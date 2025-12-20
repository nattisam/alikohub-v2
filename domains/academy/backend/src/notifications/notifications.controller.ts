import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthenticatedUser } from 'src/user/user.service';
import { AcademyProfileGuard } from 'src/auth/academy-profile.guard';
import { RoleGuard } from 'src/auth/role-guard/role-guard';
import { Roles } from 'src/auth/role-guard/roles.decorator';

@Controller()
@UseGuards(AcademyProfileGuard)
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @MessagePattern({ cmd: 'create_notification' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async create(
    @Payload() payload: { dto: CreateNotificationDto; user: AuthenticatedUser },
  ) {
    return this.service.createNotification(payload.user, payload.dto);
  }

  @MessagePattern({ cmd: 'get_my_notifications' })
  async myNotifications(@Payload() payload: { user: AuthenticatedUser }) {
    return this.service.getUserNotifications(payload.user);
  }

  @MessagePattern({ cmd: 'mark_notification_read' })
  async markRead(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return this.service.markAsRead(payload.user, payload.id);
  }

  @MessagePattern({ cmd: 'delete_notification' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async delete(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return this.service.deleteNotification(payload.user, payload.id);
  }

  @MessagePattern({ cmd: 'internal_create_progress_notification' })
  async createProgressNotification(
    @Payload() payload: { userId: string; message: string },
  ) {
    return this.service.createProgressNotification(
      payload.userId,
      payload.message,
    );
  }

  @MessagePattern({ cmd: 'internal_notify_instructor' })
  async notifyInstructor(
    @Payload()
    payload: {
      studentId: string;
      courseId: number;
      moduleTitle: string;
    },
  ) {
    return this.service.notifyInstructorProgress(
      payload.studentId,
      payload.courseId,
      payload.moduleTitle,
    );
  }
}
