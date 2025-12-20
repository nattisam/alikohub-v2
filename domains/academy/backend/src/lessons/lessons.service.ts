import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { AuthenticatedUser, UserService } from 'src/user/user.service';


@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService, private userService: UserService) { }

  async create(dto: CreateLessonDto, user: AuthenticatedUser) {
    const { dueDate, moduleId, contents, ...rest } = dto;
    const academyProfile = await this.userService.getOrCreateProfile(user)

    // Fetch the module and its parent course for the ownership check
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    if (!module) throw new NotFoundException('Module not found');

    // AUTHORIZATION: User must be the course instructor or an admin.
    const isInstructor = module.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to add a lesson to this module.');
    }

    return await this.prisma.lesson.create({
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : null,
        module: { connect: { id: moduleId } },
        ...(contents && contents.length > 0 ? { contents: { create: contents } } : {}),
      },
    });
  }

  async findByModule(moduleId: number, user: AuthenticatedUser) {
    console.log(`=== Authorization Check for Lessons ===`);
    console.log(`User ID: ${user.firebaseId}`);
    console.log(`Module ID: ${moduleId}`);

    const academyProfile = await this.userService.getOrCreateProfile(user)
    console.log(`User academy profile:`, academyProfile);

    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    console.log(`Module found:`, module);

    if (!module) throw new NotFoundException('Module not found');

    const courseId = module.courseId;
    const instructorId = module.course.instructorId;

    // AUTHORIZATION: Check if the user is an admin, the course instructor, OR enrolled.
    const isAdmin = academyProfile.role === 'ADMIN';
    const isInstructor = instructorId === user.firebaseId;
    let isEnrolled = false;

    console.log(`Initial check - Is instructor: ${isInstructor}, Is admin: ${isAdmin}`);

    if (!isAdmin && !isInstructor) {
      console.log(`Checking enrollment for user ${user.firebaseId} in course ${courseId}`);

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

    if (!isAdmin && !isInstructor && !isEnrolled) {
      console.log(`ACCESS DENIED: User ${user.firebaseId} is not authorized to view lessons for module ${moduleId}`);
      throw new ForbiddenException('You must be enrolled in this course to view its lessons.');
    }

    console.log(`ACCESS GRANTED: User ${user.firebaseId} is authorized to view lessons for module ${moduleId}`);
    return await this.prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { createdAt: 'asc' },
      include: { contents: true },
    });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const academyProfile = await this.userService.getOrCreateProfile(user)
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { contents: true, module: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    // AUTHORIZATION: Same logic as findByModule
    const isInstructor = lesson.module.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';
    let isEnrolled = false;
    if (!isInstructor && !isAdmin) {
      // Check for direct course enrollment (no cohort)
      const directEnrollment = await this.prisma.enrollment.findFirst({
        where: {
          userId: user.firebaseId,
          courseId: lesson.module.courseId,
          cohortId: null // Direct enrollment without cohort
        },
      });

      if (directEnrollment) {
        isEnrolled = true;
      } else {
        // Check for cohort-based enrollment
        const cohortEnrollment = await this.prisma.enrollment.findFirst({
          where: {
            userId: user.firebaseId,
            cohort: { courseId: lesson.module.courseId }
          },
        });
        isEnrolled = !!cohortEnrollment;
      }
    }

    if (!isInstructor && !isAdmin && !isEnrolled) {
      throw new ForbiddenException('You must be enrolled in this course to view this lesson.');
    }

    // We don't need to return the nested module/course info to the client
    const { module, ...lessonWithoutNesting } = lesson;
    return lessonWithoutNesting;
  }

  async update(id: number, dto: UpdateLessonDto, user: AuthenticatedUser) {
    const academyProfile = await this.userService.getOrCreateProfile(user)
    const { dueDate, moduleId, contents, ...rest } = dto;

    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { module: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    // AUTHORIZATION: User must be the course instructor or an admin.
    const isInstructor = lesson.module.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to update this lesson.');
    }

    return await this.prisma.lesson.update({
      where: { id },
      data: {
        ...rest,
        ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
        ...(moduleId !== undefined ? { module: { connect: { id: moduleId } } } : {}),
        ...(contents && contents.length > 0 ? { contents: { set: [], create: contents } } : {}),
      },
    });
  }

  async remove(id: number, user: AuthenticatedUser) {
    const academyProfile = await this.userService.getOrCreateProfile(user)
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { module: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    // AUTHORIZATION: User must be the course instructor or an admin.
    const isInstructor = lesson.module.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to delete this lesson.');
    }

    return await this.prisma.lesson.delete({ where: { id } });
  }

  // This method is now redundant since findOne and findByModule include contents.
  // But if you keep it, it needs the same security check.
  async getContentByLesson(lessonId: number, user: AuthenticatedUser) {
    const lesson = await this.findOne(lessonId, user); // Re-use the secure findOne logic
    return lesson.contents;
  }
}