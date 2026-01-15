import { Controller, Get, Post, Body, Param, UseGuards, Request, Inject, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../common/guard/firebase_auth.guard';
import { AdminAccessGuard } from '../common/guard/admin-access.guard';
import { CareersRoleGuard } from '../common/roles/careers-role.guard';
import { CareersRoles } from '../common/roles/careers-roles.decorator';
import { CreateJobDto } from './dto/create-job.dto';
import { ApplyJobDto } from './dto/apply-job.dto';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Careers')
@ApiBearerAuth()
@Controller('careers')
@UseGuards(AuthGuard)
export class CareersController {
  constructor(
    @Inject('CAREERS_SERVICE') private readonly careersClient: ClientProxy,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('admin/recruiters')
  @UseGuards(AdminAccessGuard)
  @ApiOperation({ summary: 'Admin: Create a new recruiter account' })
  async createRecruiter(@Body() createRecruiterDto: CreateRecruiterDto) {
    const { department, ...authData } = createRecruiterDto;
    
    // 1. Create Recruiter User in Auth Service
    const authResponse = await firstValueFrom(
      this.authClient.send({ cmd: 'create_recruiter' }, authData)
    );

    const userId = authResponse.user.firebaseId;

    // 2. Create Recruiter Profile in Careers Service
    await firstValueFrom(
      this.careersClient.send({ cmd: 'create_recruiter_profile' }, { 
        userId, 
        profileData: { department, isPrimaryRecruiter: false } 
      })
    );

    return {
      message: 'Recruiter created and profile initialized successfully',
      user: authResponse.user
    };
  }

  @Post('jobs')
  @UseGuards(CareersRoleGuard)
  @CareersRoles('RECRUITER', 'ADMIN')
  @ApiOperation({ summary: 'Create a new job posting (Recruiter/Admin)' })
  async createJob(@Request() req: any, @Body() createJobDto: CreateJobDto) {
    return firstValueFrom(
      this.careersClient.send({ cmd: 'create_job' }, { jobData: createJobDto, userId: req.user.firebaseId })
    );
  }

  @Public()
  @Get('jobs')
  @ApiOperation({ summary: 'Get all open job postings' })
  async getAllJobs() {
    return firstValueFrom(
      this.careersClient.send({ cmd: 'get_all_jobs' }, {})
    );
  }

  @Public()
  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get job details by ID' })
  async getJobById(@Param('id') id: string) {
    return firstValueFrom(
      this.careersClient.send({ cmd: 'get_job_by_id' }, parseInt(id))
    );
  }

  @Patch('jobs/:id')
  @UseGuards(CareersRoleGuard)
  @CareersRoles('RECRUITER', 'ADMIN')
  @ApiOperation({ summary: 'Update a job posting (Recruiter/Admin)' })
  async updateJob(@Request() req: any, @Param('id') id: string, @Body() updateJobDto: any) {
    return firstValueFrom(
      this.careersClient.send({ cmd: 'update_job' }, { id: parseInt(id), jobData: updateJobDto, userId: req.user.firebaseId })
    );
  }

  @Delete('jobs/:id')
  @UseGuards(CareersRoleGuard)
  @CareersRoles('RECRUITER', 'ADMIN')
  @ApiOperation({ summary: 'Delete a job posting (Recruiter/Admin)' })
  async deleteJob(@Param('id') id: string) {
    return firstValueFrom(
      this.careersClient.send({ cmd: 'delete_job' }, parseInt(id))
    );
  }

  @Post('jobs/:id/apply')
  @ApiOperation({ summary: 'Apply to a job' })
  async applyJob(@Request() req: any, @Param('id') id: string, @Body() applyJobDto: ApplyJobDto) {
    return firstValueFrom(
      this.careersClient.send({ cmd: 'apply_job' }, { 
        jobId: parseInt(id), 
        userId: req.user.firebaseId,
        applicationData: applyJobDto
      })
    );
  }

  @Get('jobs/:id/applications')
  @UseGuards(CareersRoleGuard)
  @CareersRoles('RECRUITER', 'ADMIN')
  @ApiOperation({ summary: 'Get applications for a job (Recruiter/Admin)' })
  async getJobApplications(@Param('id') id: string) {
    return firstValueFrom(
      this.careersClient.send({ cmd: 'get_job_applications' }, parseInt(id))
    );
  }

  @Get('profile/me')
  @UseGuards(CareersRoleGuard)
  @CareersRoles('RECRUITER', 'ADMIN')
  @ApiOperation({ summary: 'Get recruitment profile' })
  async getRecruiterProfile(@Request() req: any) {
    return firstValueFrom(
      this.careersClient.send({ cmd: 'get_recruiter_profile' }, req.user.firebaseId)
    );
  }
}
