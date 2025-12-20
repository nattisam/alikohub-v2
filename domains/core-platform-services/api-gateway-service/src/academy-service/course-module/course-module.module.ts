import { Module } from '@nestjs/common';
import { CourseModuleController } from './course-module.controller';

@Module({
  controllers: [CourseModuleController]
})
export class CourseModuleModule {}
