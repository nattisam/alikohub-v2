// src/client-reports/client-reports.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust the path to your Prisma service
import { CreateClientReportDto } from './dto/create-client-report.dto';
import { Prisma } from '@prisma/client';
import { AuthenticatedUser } from '../user/user.service';

@Injectable()
export class ClientReportService {
  constructor(private prisma: PrismaService) {}

  async create(
    createClientReportDto: CreateClientReportDto,
    user: AuthenticatedUser,
  ) {
    const { projectId, summary, KPIs, title } = createClientReportDto;

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found.`);
    }

    return this.prisma.clientReport.create({
      data: {
        projectId,
        summary,
        KPIs: KPIs as any,
      },
    });
  }

  findAllByProjectId(projectId: number) {
    return this.prisma.clientReport.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        generatedAt: 'desc', // Show the most recent reports first
      },
    });
  }

  async findOneById(reportId: number) {
    const report = await this.prisma.clientReport.findUnique({
      where: {
        id: reportId,
      },
    });

    if (!report) {
      throw new NotFoundException(
        `Client Report with ID ${reportId} not found.`,
      );
    }

    return report;
  }
}
