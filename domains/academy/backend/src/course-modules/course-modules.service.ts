import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { AuthenticatedUser, UserService } from 'src/user/user.service';

// The verified user object passed from the API Gateway

@Injectable()
export class CourseModulesService {
  constructor(private prisma: PrismaService, private userService: UserService) { }

  async create(dto: CreateCourseModuleDto, user: AuthenticatedUser) {
    const academyProfile = await this.userService.getOrCreateProfile(user)
    // Find the course to check for ownership
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });
    if (!course) throw new NotFoundException('Course not found');

    // AUTHORIZATION: User must be the course instructor or an admin.
    const isInstructor = course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to add a module to this course.');
    }

    return await this.prisma.module.create({ data: dto });
  }

  async findAllByCourse(courseId: number, user: AuthenticatedUser) {
    console.log(`=== Authorization Check for Course Modules ===`);
    console.log(`User ID: ${user.firebaseId}`);
    console.log(`Course ID: ${courseId}`);

    // AUTHORIZATION: To view modules, user must be enrolled, the instructor, or an admin.
    const academyProfile = await this.userService.getOrCreateProfile(user)
    console.log(`User academy profile:`, academyProfile);

    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    console.log(`Course found:`, course);

    if (!course) throw new NotFoundException('Course not found');

    const isInstructor = course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';
    let isEnrolled = false;

    console.log(`Initial check - Is instructor: ${isInstructor}, Is admin: ${isAdmin}`);

    if (!isInstructor && !isAdmin) {
      console.log(`Checking enrollment for user ${user.firebaseId}`);

      // Check for direct course enrollment (no cohort)
      const directEnrollment = await this.prisma.enrollment.findFirst({
        where: {
          userId: user.firebaseId,
          courseId: courseId,
          cohortId: null // Direct enrollment without cohort
        },
      });

      console.log(`Direct enrollment query result:`, directEnrollment);

      if (directEnrollment) {
        isEnrolled = true;
        console.log(`User is directly enrolled in course`);
      } else {
        // Check for cohort-based enrollment
        const cohortEnrollment = await this.prisma.enrollment.findFirst({
          where: {
            userId: user.firebaseId,
            cohort: { courseId: courseId }
          },
        });

        console.log(`Cohort enrollment query result:`, cohortEnrollment);
        if (cohortEnrollment) {
          isEnrolled = true;
          console.log(`User is enrolled in course through cohort`);
        }
      }
    }

    console.log(`Final authorization - Is instructor: ${isInstructor}, Is admin: ${isAdmin}, Is enrolled: ${isEnrolled}`);

    if (!isInstructor && !isAdmin && !isEnrolled) {
      console.log(`ACCESS DENIED: User ${user.firebaseId} is not authorized to view modules for course ${courseId}`);
      throw new ForbiddenException('You must be enrolled in this course to view its modules.');
    }

    console.log(`ACCESS GRANTED: User ${user.firebaseId} is authorized to view modules for course ${courseId}`);
    return await this.prisma.module.findMany({
      where: { courseId },
      include: { lessons: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: { lessons: true, course: true },
    });
    if (!module) throw new NotFoundException('Module not found');

    // AUTHORIZATION: Re-use the same logic as findAllByCourse
    const { course, ...moduleData } = module;
    await this.findAllByCourse(course.id, user); // This will throw a ForbiddenException if not allowed

    return moduleData;
  }

  async update(id: number, dto: UpdateCourseModuleDto, user: AuthenticatedUser) {
    // Find the module and its parent course for ownership check
    const academyProfile = await this.userService.getOrCreateProfile(user)
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!module) throw new NotFoundException('Module not found');

    // AUTHORIZATION: User must be the course instructor or an admin.
    const isInstructor = module.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to update this module.');
    }

    return await this.prisma.module.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, user: AuthenticatedUser) {
    const academyProfile = await this.userService.getOrCreateProfile(user)
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!module) throw new NotFoundException('Module not found');

    // AUTHORIZATION: User must be the course instructor or an admin.
    const isInstructor = module.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to delete this module.');
    }

    return await this.prisma.module.delete({ where: { id } });
  }
}