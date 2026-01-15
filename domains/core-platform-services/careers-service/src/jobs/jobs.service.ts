import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createJob(data: any, userId: string) {
    this.logger.log(`Creating job: ${data.title} by user: ${userId}`);
    return this.prisma.job.create({
      data: {
        ...data,
        postedBy: userId,
      },
    });
  }

  async findAllJobs() {
    return this.prisma.job.findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneJob(id: number) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        applications: true,
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async updateJob(id: number, data: any, userId: string) {
    const job = await this.findOneJob(id);
    
    // In a single company model, any recruiter can manage jobs, 
    // but usually we check if they are the one who posted it or an admin.
    // For now, let's just update.
    return this.prisma.job.update({
      where: { id },
      data,
    });
  }

  async deleteJob(id: number) {
    return this.prisma.job.delete({
      where: { id },
    });
  }

  async applyToJob(jobId: number, userId: string, applicationData: { coverLetter?: string; resumeUrl: string }) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.status !== 'OPEN') {
      throw new NotFoundException(`Job with ID ${jobId} is not available for applications`);
    }

    return this.prisma.jobApplication.create({
      data: {
        jobId,
        userId,
        ...applicationData,
      },
    });
  }

  async getApplicationsForJob(jobId: number) {
    return this.prisma.jobApplication.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRecruiterProfile(userId: string) {
    return this.prisma.recruiterProfile.findUnique({
      where: { userId },
    });
  }

  async createRecruiterProfile(userId: string, data: any) {
    return this.prisma.recruiterProfile.create({
      data: {
        userId,
        ...data,
      },
    });
  }
}
