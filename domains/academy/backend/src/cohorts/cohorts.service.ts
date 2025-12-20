import {
  Injectable,
  NotFoundException,
  ForbiddenException, 
} from '@nestjs/common';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser, UserService } from 'src/user/user.service';


@Injectable()
export class CohortsService {
  constructor(private prisma: PrismaService, private userService: UserService) {}

  
  async create(dto: CreateCohortDto, user: AuthenticatedUser) {
    const academyProfile = await this.userService.getOrCreateProfile(user)
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });
    if (!course) throw new NotFoundException('Course not found');

    if (course.instructorId !== user.firebaseId && academyProfile.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to create a cohort for this course.');
    }

    return await this.prisma.cohort.create({ data: dto });
  }

  async findAll(courseId?: number) {
    const where: any = {};
    if (courseId) where.courseId = courseId;
    return await this.prisma.cohort.findMany({ where });
  }

  async findOne(id: number) {
    const cohort = await this.prisma.cohort.findUnique({ where: { id } });
    if (!cohort) throw new NotFoundException('Cohort not found');
    return cohort;
  }

  async update(id: number, dto: Partial<CreateCohortDto>, user: AuthenticatedUser) {
    // Find the cohort and its parent course for the ownership check
    const academyProfile = await this.userService.getOrCreateProfile(user)
    const cohort = await this.prisma.cohort.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!cohort) throw new NotFoundException('Cohort not found');

    // AUTHORIZATION: User must be the course instructor or an admin.
    if (cohort.course.instructorId !== user.firebaseId && academyProfile.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to update this cohort.');
    }

    return await this.prisma.cohort.update({ where: { id }, data: dto });
  }

  async remove(id: number, user: AuthenticatedUser) {
    const academyProfile = await this.userService.getOrCreateProfile(user)
    const cohort = await this.prisma.cohort.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!cohort) throw new NotFoundException('Cohort not found');

    // AUTHORIZATION: User must be the course instructor or an admin.
    if (cohort.course.instructorId !== user.firebaseId && academyProfile.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to delete this cohort.');
    }
    
    return await this.prisma.cohort.delete({ where: { id } });
  }
}