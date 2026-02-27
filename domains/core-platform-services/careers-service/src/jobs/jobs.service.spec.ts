
import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  job: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('JobsService', () => {
  let service: JobsService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('findAllJobs', () => {
    it('should return "Not specified" if salaryRange is null (TEST-06)', async () => {
      prisma.job.findMany.mockResolvedValue([
        { id: 1, title: 'Job 1', salaryRange: null },
        { id: 2, title: 'Job 2', salaryRange: '$100k' },
      ]);

      const result = await service.findAllJobs();
      expect(result[0].salaryRange).toBe('Not specified');
      expect(result[1].salaryRange).toBe('$100k');
    });
  });

  describe('findOneJob', () => {
    it('should return "Not specified" if salaryRange is null (TEST-06)', async () => {
      prisma.job.findUnique.mockResolvedValue({ id: 1, title: 'Job 1', salaryRange: null });

      const result = await service.findOneJob(1);
      expect(result.salaryRange).toBe('Not specified');
    });
  });

  describe('applyToJob', () => {
    it('should throw ForbiddenException if resumeUrl is not http/https (TEST-07)', async () => {
       await expect(
           service.applyToJob(1, 'uid', { resumeUrl: 'ftp://bad-url' })
       ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if resumeUrl is invalid', async () => {
        await expect(
            service.applyToJob(1, 'uid', { resumeUrl: 'not-a-url' })
        ).rejects.toThrow(ForbiddenException);
     });
/*
    // Mock setup for successful call would require more mocking, but validation is the key test here
    it('should pass if resumeUrl is valid https', async () => {
         // Mock job existence
         prisma.job.findUnique.mockResolvedValue({ id: 1, status: 'OPEN' });
         // ...
    });
*/
  });
});
