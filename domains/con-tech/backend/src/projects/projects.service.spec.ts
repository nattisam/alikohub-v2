
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

const mockPrismaService = {
  project: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  projectUpdate: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  projectDocument: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

const mockUserService = {
  getOrCreateProfile: jest.fn(),
  getUsersByIds: jest.fn().mockResolvedValue([]),
};

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prisma: any;
  let userService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    prisma = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateProgress', () => {
    it('should throw BadRequestException if progress is invalid', async () => {
      await expect(
        service.updateProgress(1, 150, { firebaseId: 'uid' } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow contractor to update their assigned project', async () => {
      prisma.project.findUnique.mockResolvedValue({
        id: 1,
        contractorId: 'uid',
        manager: 'manager',
      });
      userService.getOrCreateProfile.mockResolvedValue({ role: 'CONTRACTOR' });
      prisma.project.update.mockResolvedValue({ id: 1, progress: 50 });

      const result = await service.updateProgress(1, 50, { firebaseId: 'uid' } as any);
      expect(prisma.project.update).toHaveBeenCalled();
      expect(result.progress).toBe(50);
    });

    it('should throw ForbiddenException if unassigned contractor tries to update', async () => {
      prisma.project.findUnique.mockResolvedValue({
        id: 1,
        contractorId: 'other-uid',
        manager: 'manager',
      });
      userService.getOrCreateProfile.mockResolvedValue({ role: 'CONTRACTOR' });

      await expect(
        service.updateProgress(1, 50, { firebaseId: 'uid' } as any),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('createProjectUpdate (Weekly Updates)', () => {
     it('should create an update if user is authorized', async () => {
        prisma.project.findUnique.mockResolvedValue({
            id: 1,
            contractorId: 'uid',
        });
        userService.getOrCreateProfile.mockResolvedValue({ role: 'CONTRACTOR' });
        prisma.projectUpdate.create.mockResolvedValue({ id: 1, text: 'update' });

        await service.createProjectUpdate(1, 'update', { firebaseId: 'uid' } as any);
        expect(prisma.projectUpdate.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                text: 'update',
                isVisibleToClient: false // default check
            })
        }));
     });

     it('should set isVisibleToClient if provided', async () => {
        prisma.project.findUnique.mockResolvedValue({
             id: 1,
             contractorId: 'uid',
         });
         userService.getOrCreateProfile.mockResolvedValue({ role: 'CONTRACTOR' });
         
         await service.createProjectUpdate(1, 'update', { firebaseId: 'uid' } as any, true);
         expect(prisma.projectUpdate.create).toHaveBeenCalledWith(expect.objectContaining({
             data: expect.objectContaining({
                 isVisibleToClient: true 
             })
         }));
      });
  });

  describe('addDocument', () => {
      it('should add a document with visibility flags', async () => {
        prisma.project.findUnique.mockResolvedValue({
            id: 1,
            contractorId: 'uid',
        });
        userService.getOrCreateProfile.mockResolvedValue({ role: 'CONTRACTOR' });

        const dto = { title: 'doc', url: 'http://doc', isVisibleToClient: true };
        await service.addDocument(1, dto, { firebaseId: 'uid' } as any);

        expect(prisma.projectDocument.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                title: 'doc',
                isVisibleToClient: true
            })
        }));
      });
  });
});
