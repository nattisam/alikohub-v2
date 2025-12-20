import { IsEnum } from 'class-validator';
import { CourseStatus } from '@prisma/client';

export class UpdateCourseStatusDto {
  @IsEnum(CourseStatus)
  status: CourseStatus;
}
