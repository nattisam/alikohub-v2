import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProgressAndAnalyticsService } from './progress-analytics.service';
import { AuthenticatedUser } from 'src/user/user.service';
import { AcademyProfileGuard } from 'src/auth';
import { RoleGuard } from 'src/auth/role-guard/role-guard';
import { Roles } from 'src/auth/role-guard/roles.decorator';

@Controller()
@UseGuards(AcademyProfileGuard)
export class ProgressAndAnalyticsController {
  constructor(private readonly service: ProgressAndAnalyticsService) { }

  @MessagePattern({ cmd: 'get_instructor_stats' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async instructorStats(@Payload() payload: { user: AuthenticatedUser }) {
    return this.service.getInstructorStats(payload.user);
  }

  @MessagePattern({ cmd: 'get_user_progress' })
  async userProgress(
    @Payload()
    payload: {
      targetUserId: string;
      courseId: number;
      user: AuthenticatedUser;
    },
  ) {
    return this.service.getUserProgress(
      payload.user,
      payload.targetUserId,
      payload.courseId,
    );
  }

  @MessagePattern({ cmd: 'get_course_analytics' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async courseAnalytics(
    @Payload() payload: { courseId: number; user: AuthenticatedUser },
  ) {
    return this.service.getCourseAnalytics(payload.courseId, payload.user);
  }

  @MessagePattern({ cmd: 'complete_lesson' })
  @UseGuards(RoleGuard)
  @Roles('STUDENT')
  async completeLesson(
    @Payload()
    payload: {
      courseId: number;
      lessonId: number;
      user: AuthenticatedUser;
    },
  ) {
    return this.service.completeLesson(
      payload.user,
      payload.courseId,
      payload.lessonId,
    );
  }

  @MessagePattern({ cmd: 'get_my_dashboard' })
  @UseGuards(RoleGuard)
  @Roles('STUDENT')
  async myCoursesProgress(@Payload() payload: { user: AuthenticatedUser }) {
    return this.service.getStudentDashboard(payload.user);
  }

  @MessagePattern({ cmd: 'get_students_progress_for_course' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async studentsProgress(
    @Payload() payload: { courseId: number; user: AuthenticatedUser },
  ) {
    return this.service.getStudentsProgressForCourse(
      payload.user,
      payload.courseId,
    );
  }

  @MessagePattern({ cmd: 'get_overall_analytics' })
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  async overallAnalytics(@Payload() payload: { user: AuthenticatedUser }) {
    return this.service.getOverallPlatformAnalytics(payload.user);
  }

  // --- NEW ENDPOINTS ---

  @MessagePattern({ cmd: 'update_content_progress' })
  @UseGuards(RoleGuard)
  @Roles('STUDENT')
  async updateContentProgress(
    @Payload()
    payload: {
      courseId: number;
      moduleId: number;
      lessonId: number;
      contentId: number;
      status: string;
      score?: number;
      user: AuthenticatedUser;
    },
  ) {
    return this.service.updateContentProgress(
      payload.user,
      payload.courseId,
      payload.moduleId,
      payload.lessonId,
      payload.contentId,
      payload.status,
      payload.score,
    );
  }

  @MessagePattern({ cmd: 'get_detailed_student_progress' })
  async getDetailedStudentProgress(
    @Payload()
    payload: {
      targetUserId: string;
      courseId: number;
      user: AuthenticatedUser;
    },
  ) {
    return this.service.getDetailedStudentProgress(
      payload.user,
      payload.targetUserId,
      payload.courseId,
    );
  }

  @MessagePattern({ cmd: 'get_instructor_dashboard' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async getInstructorDashboard(@Payload() payload: { user: AuthenticatedUser }) {
    return this.service.getInstructorDashboard(payload.user);
  }

  // --- NEW: Get student stats for sidebar ---
  @MessagePattern({ cmd: 'get_student_stats' })
  @UseGuards(RoleGuard)
  @Roles('STUDENT')
  async getStudentStats(@Payload() payload: { user: AuthenticatedUser }) {
    return this.service.getStudentStats(payload.user);
  }
}