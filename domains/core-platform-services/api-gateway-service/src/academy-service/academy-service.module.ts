import { Module } from '@nestjs/common';
import { AcademyProfileModule } from 'src/academy-service/academy-profile/academy-profile.module';
import { CohortModule } from 'src/academy-service/cohort/cohort.module';
import { ContentModule } from 'src/academy-service/content/content.module';
import { CourseModuleModule } from 'src/academy-service/course-module/course-module.module';
import { CourseModule } from 'src/academy-service/course/course.module';
import { EnrollmentModule } from 'src/academy-service/enrollment/enrollment.module';
import { LessonModule } from 'src/academy-service/lesson/lesson.module';
import { NotificationModule } from 'src/academy-service/notification/notification.module';
import { ProgressAndAnalyticsModule } from 'src/academy-service/progress-and-analytics/progress-and-analytics.module';
import { TeachingScheduleModule } from 'src/academy-service/teaching-schedule/teaching-schedule.module';
import { AcademyController } from './academy-service.controller';
import { RouterModule } from '@nestjs/core';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [
    AcademyProfileModule,
    CourseModule,
    CourseModuleModule,
    CohortModule,
    ContentModule,
    EnrollmentModule,
    LessonModule,
    NotificationModule,
    ProgressAndAnalyticsModule,
    TeachingScheduleModule,
    FileUploadModule,
    RouterModule.register([
      {
        path: '',
        module: AcademyServiceModule,
        children: [
          { path: '/', module: AcademyProfileModule },
          { path: '/', module: CourseModule },
          { path: '/', module: CourseModuleModule },
          { path: '/', module: CohortModule },
          { path: '/', module: ContentModule },
          { path: '/', module: EnrollmentModule },
          { path: '/', module: LessonModule },
          { path: '/', module: NotificationModule },
          { path: '/', module: ProgressAndAnalyticsModule },
          { path: '/', module: TeachingScheduleModule },
        ],
      },
    ]),
  ],
  controllers: [AcademyController],
})
export class AcademyServiceModule {}
