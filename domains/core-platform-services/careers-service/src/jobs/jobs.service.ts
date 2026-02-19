import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

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

  async applyToJob(jobId: number, user: any, applicationData: any) {
    const userId = user.firebaseId;
    
    // 1. Get user data from token first
    const tokenData = {
      fullName: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.firstname || '',
      email: user.email || '',
    };

    // 2. Load CareersProfile for additional fields if not in applicationData
    const profile = await this.userService.getProfile(userId);

    // 3. Prepare application info by merging sources
    // Precedence: explicit applicationData > saved CareersProfile > Token data
    const fullName = applicationData.fullName || tokenData.fullName || profile?.fullName;
    const email = applicationData.email || tokenData.email || profile?.email;

    if (!fullName || !email) {
      this.logger.warn(`Application failed for user ${userId}: Missing full name or email`);
      throw new ForbiddenException('Full name and email are required. Please provide them in your application or update your profile.');
    }

    // 4. Validate resumeUrl
    try {
      if (applicationData.resumeUrl) {
        const url = new URL(applicationData.resumeUrl);
        if (!['http:', 'https:'].includes(url.protocol)) {
            throw new Error();
        }
      }
    } catch (e) {
      throw new ForbiddenException('Invalid resume URL provided. Must be a valid HTTP/HTTPS URL.');
    }

    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.status !== 'OPEN') {
      throw new NotFoundException(`Job with ID ${jobId} is not available for applications`);
    }

    // 5. Update CareersProfile automatically if new info is provided
    const profileUpdate: any = {};
    const profileFields = ['phone', 'experienceYears', 'currentTitle', 'currentCompany', 'industry', 'linkedInUrl', 'portfolioUrl'];
    profileFields.forEach(field => {
      if (applicationData[field]) profileUpdate[field] = applicationData[field];
    });

    if (Object.keys(profileUpdate).length > 0 || !profile) {
      await this.userService.createOrUpdateProfile(userId, {
        fullName,
        email,
        ...profileUpdate
      });
    }

    // 6. Create the application snapshot
    return this.prisma.jobApplication.create({
      data: {
        jobId,
        userId,
        fullName,
        email,
        phone: applicationData.phone || profile?.phone,
        coverLetter: applicationData.coverLetter,
        resumeUrl: applicationData.resumeUrl || '',
        experienceYears: applicationData.experienceYears || profile?.experienceYears,
        currentTitle: applicationData.currentTitle || profile?.currentTitle,
        currentCompany: applicationData.currentCompany || profile?.currentCompany,
        industry: applicationData.industry || profile?.industry,
        linkedInUrl: applicationData.linkedInUrl || profile?.linkedInUrl,
        portfolioUrl: applicationData.portfolioUrl || profile?.portfolioUrl,
        additionalInfo: applicationData.additionalInfo,
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
