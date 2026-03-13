import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthenticatedUser, UserService } from '../user/user.service';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async createNotification(
    sender: AuthenticatedUser,
    dto: CreateNotificationDto,
  ) {
    // AUTHORIZATION: Check the role of the user sending the notification.
    const academyProfile = await this.userService.getOrCreateProfile(sender);
    if (academyProfile.role === 'STUDENT') {
      throw new ForbiddenException('Students cannot create notifications.');
    }
    if (!dto.userId) {
      throw new ForbiddenException('Target userId is required');
    }

    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        message: dto.message,
        type: dto.type,
        isRead: false,
      },
    });
  }

  async createProgressNotification(userId: string, message: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        message,
        type: 'progress',
        isRead: false,
      },
    });
  }

  async notifyInstructorProgress(
    studentId: string,
    courseId: number,
    moduleTitle: string,
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) return;

    // Use the UsersService to get student details
    const student = await this.userService.getUserById(studentId);
    if (!student) return;

    const studentName = `${student.firstname} ${student.lastname}`.trim();
    const message = `${studentName} completed module "${moduleTitle}" in "${course.title}".`;

    return this.prisma.notification.create({
      data: {
        userId: course.instructorId,
        message,
        type: 'progress',
        isRead: false,
      },
    });
  }

  async getUserNotifications(user: AuthenticatedUser) {
    return this.prisma.notification.findMany({
      where: { userId: user.firebaseId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(user: AuthenticatedUser, notificationId: number) {
    const notif = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notif || notif.userId !== user.firebaseId) {
      throw new ForbiddenException(
        'You are not allowed to mark this notification as read.',
      );
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async deleteNotification(user: AuthenticatedUser, notificationId: number) {
    const academyProfile = await this.userService.getOrCreateProfile(user);
    const notif = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notif) throw new NotFoundException('Notification not found');

    // AUTHORIZATION: Only admins or instructors can delete notifications.
    if (academyProfile.role === 'STUDENT') {
      throw new ForbiddenException('Students cannot delete notifications.');
    }

    return this.prisma.notification.delete({ where: { id: notificationId } });
  }
}
