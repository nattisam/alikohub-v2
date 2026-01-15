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
    console.log(`=== Accessing Course Modules ===`);
    console.log(`User ID: ${user.firebaseId}`);
    console.log(`Course ID: ${courseId}`);

    // AUTHORIZATION: We now allow all users to view course modules (the curriculum).
    // This allows prospective students to see what the course covers.
    // Lesson CONTENT is still protected in the LessonsService.
    
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    console.log(`ACCESS GRANTED: User ${user.firebaseId} viewing curriculum for course ${courseId}`);
    return await this.prisma.module.findMany({
      where: { courseId },
      include: { 
        lessons: {
          select: {
            id: true,
            title: true,
            type: true,
            maxScore: true,
            dueDate: true,
            createdAt: true,
            updatedAt: true,
            // Exclude content for public view
          },
          orderBy: { createdAt: 'asc' }
        },
        exercises: {
            select: {
                id: true,
                title: true,
                type: true,
                points: true,
                order: true,
                // Exclude correct answer
            },
            orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: { lessons: true, exercises: true, course: true },
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