import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserWithAcademy } from '../auth/types/user-with-academy.interface';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserWithAcademy | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        academyUser: true,
        consultancyUser: true,
        contechUser: true,
        eventsUser: true,
      },
    });
  }

  async findByFirebaseId(firebaseId: string): Promise<UserWithAcademy | null> {
    return this.prisma.user.findUnique({
      where: { firebaseId },
      include: {
        academyUser: true,
        consultancyUser: true,
        contechUser: true,
        eventsUser: true,
      },
    });
  }

  async findById(userId: string): Promise<UserWithAcademy | null> {
    return this.prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        academyUser: true,
        consultancyUser: true,
        contechUser: true,
        eventsUser: true,
      },
    });
  }

  async createUser(data: any) {
    return this.prisma.user.create({
      data,
    });
  }

  // Academy-specific methods
  async updateAcademyRole(userId: number, role: string, status: string) {
    return this.prisma.academyUser.upsert({
      where: { userId: userId.toString() },
      update: { role: role as any, status },
      create: { userId: userId.toString(), role: role as any, status },
    });
  }

  async updateActiveAcademyRole(userId: number, activeRole: string) {
    return this.prisma.academyUser.update({
      where: { userId: userId.toString() },
      data: { role: activeRole as any }, // Using role field instead of activeRole
    });
  }

  async createTeacherApplication(applicationData: any) {
    // For now, return a mock response since teacherApplication model doesn't exist
    // In a real implementation, you would create this model in your Prisma schema
    return {
      id: 'mock-id',
      ...applicationData,
      status: 'PENDING',
      submittedAt: new Date()
    };
  }

  async getTeacherApplications() {
    // For now, return empty array since teacherApplication model doesn't exist
    return [];
  }

  async getTeacherApplication(applicationId: string) {
    // For now, return null since teacherApplication model doesn't exist
    return null;
  }

  async updateTeacherApplicationStatus(applicationId: string, status: string) {
    // For now, return mock response since teacherApplication model doesn't exist
    return { id: applicationId, status };
  }

  async hasPendingTeacherApplication(userId: string) {
    // For now, return false since teacherApplication model doesn't exist
    return false;
  }
}
