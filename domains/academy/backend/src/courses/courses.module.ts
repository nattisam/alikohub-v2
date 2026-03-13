import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CourseAccessGuard } from './guards/course-access.guard';
import { InstructorCourseGuard } from './guards/instructor-course.guard';

@Module({
  imports: [PrismaModule],
  controllers: [CoursesController],
  providers: [CoursesService, CourseAccessGuard, InstructorCourseGuard],
  exports: [CoursesService],
})
export class CoursesModule {}
