import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ApplicationStatus } from '../generated/client';
import { generateUniqueCode } from '../common/utils/code-generator.util';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<Prisma.ApplicationCreateInput, 'applicationCode'>) {
    const applicationCode = await generateUniqueCode(
      this.prisma,
      this.prisma.application,
      'applicationCode',
      'APP-ALC-',
    );

    return this.prisma.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: { ...data, applicationCode },
      });

      await tx.applicationStatusLog.create({
        data: {
          applicationId: application.id,
          newStatus: application.status,
          notes: 'Initial submission',
        },
      });

      return application;
    });
  }

  async findAll() {
    return this.prisma.application.findMany({
      include: { logs: true, documents: true },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { logs: true, documents: true },
    });
    if (!application)
      throw new NotFoundException(`Application ${id} not found`);
    return application;
  }

  async findByUserId(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: { logs: true, documents: true },
    });
  }

  async updateStatus(
    id: string,
    newStatus: ApplicationStatus,
    notes?: string,
    changedBy?: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const oldApp = await tx.application.findUnique({ where: { id } });
      if (!oldApp) throw new NotFoundException(`Application ${id} not found`);

      const updatedApp = await tx.application.update({
        where: { id },
        data: { status: newStatus },
      });

      await tx.applicationStatusLog.create({
        data: {
          applicationId: id,
          oldStatus: oldApp.status,
          newStatus,
          notes,
          changedBy,
        },
      });

      return updatedApp;
    });
  }

  async update(id: string, data: Prisma.ApplicationUpdateInput) {
    await this.findOne(id);
    return this.prisma.application.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.application.delete({ where: { id } });
  }

  // --- Document CRUD ---
  async addDocument(data: Prisma.ApplicationDocumentCreateInput) {
    return this.prisma.applicationDocument.create({ data });
  }

  async findDocuments(applicationId: string) {
    return this.prisma.applicationDocument.findMany({
      where: { applicationId },
    });
  }

  async removeDocument(id: string) {
    return this.prisma.applicationDocument.delete({ where: { id } });
  }
}
