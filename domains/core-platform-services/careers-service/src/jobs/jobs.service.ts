import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createJob(data: any, userId: string) {
    this.logger.log(`Creating job: ${data.title} by user: ${userId}`);
    
    // Normalize JobType (e.g., if frontend sends INTERN instead of INTERNSHIP)
    if (data.type === 'INTERN') {
      data.type = 'INTERNSHIP';
    }

    return this.prisma.job.create({
      data: {
        ...data,
        postedBy: userId,
      },
    });
  }

  async findAllJobs() {
    const jobs = await this.prisma.job.findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' },
    });
    return jobs.map(job => ({
      ...job,
      salaryRange: job.salaryRange || 'Not specified',
    }));
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

    return {
      ...job,
      salaryRange: job.salaryRange || 'Not specified',
    };
  }

  async updateJob(id: number, data: any, userId: string, isAdmin: boolean = false) {
    const job = await this.prisma.job.findUnique({ where: { id } });

    if (!job) {
       throw new NotFoundException(`Job with ID ${id} not found`);
    }
    
    // Ownership check: only the poster or an admin can update
    if (!isAdmin && job.postedBy !== userId) {
      this.logger.warn(`User ${userId} attempted to update job ${id} without permission`);
      throw new ForbiddenException('You do not have permission to update this job');
    }

    // Normalize JobType
    if (data.type === 'INTERN') {
      data.type = 'INTERNSHIP';
    }

    return this.prisma.job.update({
      where: { id },
      data,
    });
  }

  async deleteJob(id: number, userId: string, isAdmin: boolean = false) {
    const job = await this.prisma.job.findUnique({ where: { id } });

    if (!job) {
       throw new NotFoundException(`Job with ID ${id} not found`);
    }

    // Ownership check
    if (!isAdmin && job.postedBy !== userId) {
       this.logger.warn(`User ${userId} attempted to delete job ${id} without permission`);
       throw new ForbiddenException('You do not have permission to delete this job');
    }

    return this.prisma.job.delete({
      where: { id },
    });
  }

  async applyToJob(jobId: number, userId: string, applicationData: { coverLetter?: string; resumeUrl: string }) {
    // Validate resumeUrl
    try {
      const url = new URL(applicationData.resumeUrl);
      if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error();
      }
    } catch (e) {
      throw new ForbiddenException('Invalid resume URL provided. Must be a valid HTTP/HTTPS URL.');
    }

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
