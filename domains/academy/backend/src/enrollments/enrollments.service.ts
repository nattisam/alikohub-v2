import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { AuthenticatedUser, UserService } from 'src/user/user.service';
import { CourseStatus } from '@prisma/client';


@Injectable()
export class EnrollmentsService {
  private readonly logger = new Logger(EnrollmentsService.name);

  constructor(private prisma: PrismaService, private userService: UserService) { }


  async create(dto: CreateEnrollmentDto, user: AuthenticatedUser) {
    this.logger.log(`Creating enrollment. DTO: ${JSON.stringify(dto)}, User: ${JSON.stringify(user)}`);

    // Log the raw DTO for debugging
    console.log("Enrollment Service - Received DTO:", dto);
    console.log("Enrollment Service - DTO keys:", Object.keys(dto));
    console.log("Enrollment Service - cohortId value:", dto.cohortId);
    console.log("Enrollment Service - cohortId type:", typeof dto.cohortId);

    // Check if cohortId is explicitly null or undefined
    if (dto.cohortId === null) {
      console.log("Enrollment Service - cohortId is explicitly null");
    } else if (dto.cohortId === undefined) {
      console.log("Enrollment Service - cohortId is undefined");
    } else {
      console.log("Enrollment Service - cohortId has a value:", dto.cohortId);
    }

    // Manual validation
    if (!dto.courseId) {
      throw new BadRequestException('Course ID is required');
    }

    if (dto.courseId && !Number.isInteger(dto.courseId)) {
      throw new BadRequestException('Course ID must be an integer');
    }

    if (dto.cohortId !== undefined && dto.cohortId !== null && !Number.isInteger(dto.cohortId)) {
      throw new BadRequestException('Cohort ID must be an integer');
    }

    const academyProfile = await this.userService.getOrCreateProfile(user)
    this.logger.log(`User academy profile: ${JSON.stringify(academyProfile)}`);

    let userIdToEnroll: string;

    if (dto.userId) {
      if (academyProfile.role !== 'ADMIN') {
        throw new ForbiddenException('Only admins can enroll other users.')
      }
      userIdToEnroll = dto.userId;
    } else {
      userIdToEnroll = user.firebaseId;
    }

    this.logger.log(`User ID to enroll: ${userIdToEnroll}`);

    // Ensure user has an academy profile
    const userProfile = await this.userService.ensureProfileExists(userIdToEnroll);
    
    if (!userProfile) {
      throw new BadRequestException(`User with ID ${userIdToEnroll} could not be synchronized or does not exist in the Auth Service.`);
    }


    // Validate that the course exists and is published
    let course;
    try {
      course = await this.prisma.course.findUnique({
        where: { id: dto.courseId }
      });

      if (!course) {
        throw new BadRequestException(`Course with ID ${dto.courseId} does not exist.`);
      }

      if (course.status !== CourseStatus.PUBLISHED) {
        throw new BadRequestException(`Course with ID ${dto.courseId} is not published and cannot be enrolled in.`);
      }

      this.logger.log(`Course validation passed. Course: ${JSON.stringify(course)}`);
    } catch (error) {
      this.logger.error(`Error validating course: ${error.message}`, error.stack);
      throw error;
    }

    // Handle cohort logic - if cohortId provided, validate it; otherwise allow direct course enrollment
    let cohortId = dto.cohortId;
    if (cohortId !== undefined && cohortId !== null) {
      // Validate that the cohort exists and is associated with the course
      try {
        const cohort = await this.prisma.cohort.findUnique({
          where: { id: cohortId },
          include: { course: true }
        });

        if (!cohort) {
          throw new BadRequestException(`Cohort with ID ${cohortId} does not exist.`);
        }

        if (cohort.courseId !== dto.courseId) {
          throw new BadRequestException(`Cohort ${cohortId} is not associated with course ${dto.courseId}.`);
        }

        this.logger.log(`Cohort validation passed. Cohort: ${JSON.stringify(cohort)}`);
      } catch (error) {
        this.logger.error(`Error validating cohort: ${error.message}`, error.stack);
        throw error;
      }
    } else {
      this.logger.log(`No cohort ID provided, allowing direct course enrollment`);
      console.log("Enrollment Service - Processing direct course enrollment (no cohort)");
    }

    // --- FREE vs PAID Placeholder Logic ---
    const isPaid = course.price && course.price > 0;
    const enrollmentType = isPaid ? 'PAID' : 'FREE';
    const paymentStatus = isPaid ? 'PENDING' : 'COMPLETED';

    try {
      console.log("Enrollment Service - Creating enrollment record with:", {
        userId: userIdToEnroll,
        cohortId: cohortId, // This can be null for direct course enrollment
        courseId: dto.courseId,
        enrollmentType: enrollmentType,
        paymentStatus: paymentStatus
      });

      const enrollment = await this.prisma.enrollment.create({
        data: {
          userId: userIdToEnroll,
          cohortId: cohortId, 
          courseId: dto.courseId,
          enrollmentType: enrollmentType,
          paymentStatus: paymentStatus
        } as any,
      });

      this.logger.log(`Enrollment created successfully: ${JSON.stringify(enrollment)}`);
      console.log("Enrollment Service - Enrollment created successfully:", enrollment);
      return enrollment;
    } catch (e: any) {
      this.logger.error(`Error creating enrollment: ${e.message}`, e.stack);
      console.log("Enrollment Service - Error creating enrollment:", e);
      if (e.code === 'P2002') {
        throw new ConflictException('User already enrolled in this course');
      }
      throw e;
    }
  }

  async findAll(user: AuthenticatedUser) {
    const academyProfile = await this.userService.getOrCreateProfile(user)
    if (academyProfile.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to view all enrollments.');
    }

    // 1. Fetch the raw enrollment data
    const enrollments = await this.prisma.enrollment.findMany({
      include: { cohort: true }, // We can still include cohort
    });

    // --- DATA ENRICHMENT ---
    // 2. Collect all unique user IDs from the enrollments
    const userIds = [...new Set(enrollments.map((e) => e.userId))];
    if (userIds.length === 0) return [];

    // 3. Fetch all required user data in a single batch call from the auth-service
    const users = await this.userService.getUsersByIds(userIds);

    // 4. Map the user data back to the enrollments
    return enrollments.map((enrollment) => ({
      ...enrollment,
      user: users.find((u) => u.firebaseId === enrollment.userId) || null,
    }));
  }

  async findByCohort(cohortId: number, user: AuthenticatedUser) {
    // AUTHORIZATION: User must be an ADMIN or the INSTRUCTOR of the course
    const academyProfile = await this.userService.getOrCreateProfile(user)
    const cohort = await this.prisma.cohort.findUnique({
      where: { id: cohortId },
      include: { course: true },
    });
    if (!cohort) {
      throw new NotFoundException('Cohort not found');
    }

    const isInstructor = cohort.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to view enrollments for this cohort.');
    }

    // Same enrichment pattern as findAll()
    const enrollments = await this.prisma.enrollment.findMany({
      where: { cohortId },
    });
    const userIds = [...new Set(enrollments.map((e) => e.userId))];
    if (userIds.length === 0) return [];
    const users = await this.userService.getUsersByIds(userIds);
    return enrollments.map((enrollment) => ({
      ...enrollment,
      user: users.find((u) => u.firebaseId === enrollment.userId) || null,
    }));
  }

  async remove(id: number, user: AuthenticatedUser) {
    const academyProfile = await this.userService.getOrCreateProfile(user)
    const enrollment = await this.prisma.enrollment.findUnique({ where: { id } });
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // AUTHORIZATION: User must be an ADMIN or the person who is enrolled.
    // (An instructor could also be allowed, add that logic if needed).
    const isEnrolledUser = enrollment.userId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isEnrolledUser && !isAdmin) {
      throw new ForbiddenException('You do not have permission to remove this enrollment.');
    }

    return await this.prisma.enrollment.delete({ where: { id } });
  }

  async findMyEnrollments(user: AuthenticatedUser) {
    // Fetch the enrollments for the current user
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId: user.firebaseId },
      include: {
        cohort: {
          include: { course: true }
        },
        // Also include direct course enrollment (when cohort is null)
        course: true
      },
    });

    return enrollments.map(enrollment => {
      // If this is a cohort-based enrollment, use the cohort's course
      if (enrollment.cohort) {
        return {
          ...enrollment,
          course: enrollment.cohort.course,
        };
      }
      // If this is a direct course enrollment, use the course directly
      return {
        ...enrollment,
        course: enrollment.course,
      };
    });
  }

  async findByUserId(userId: string, requestingUser: AuthenticatedUser) {
    // AUTHORIZATION: User must be an ADMIN or the person whose enrollments are being requested.
    const academyProfile = await this.userService.getOrCreateProfile(requestingUser);
    const isRequestedUser = userId === requestingUser.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isRequestedUser && !isAdmin) {
      throw new ForbiddenException('You do not have permission to view these enrollments.');
    }

    // Fetch the enrollments for the specified user
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        cohort: {
          include: { course: true }
        },
        // Also include direct course enrollment (when cohort is null)
        course: true
      },
    });

    return enrollments.map(enrollment => {
      // If this is a cohort-based enrollment, use the cohort's course
      if (enrollment.cohort) {
        return {
          ...enrollment,
          course: enrollment.cohort.course,
        };
      }
      // If this is a direct course enrollment, use the course directly
      return {
        ...enrollment,
        course: enrollment.course,
      };
    });
  }

  async findByCourse(courseId: number, user: AuthenticatedUser) {
    const academyProfile = await this.userService.getOrCreateProfile(user);
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('Course not found');

    const isInstructor = course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to view enrollments for this course.');
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: { courseId },
    });
    const userIds = [...new Set(enrollments.map((e) => e.userId))];
    if (userIds.length === 0) return [];
    const users = await this.userService.getUsersByIds(userIds);
    return enrollments.map((enrollment) => ({
      ...enrollment,
      user: users.find((u) => u.firebaseId === enrollment.userId) || null,
    }));
  }
}