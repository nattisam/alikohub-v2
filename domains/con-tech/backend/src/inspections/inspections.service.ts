import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Your Prisma service
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Your Cloudinary service
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { AuthenticatedUser, UserService } from '../user/user.service';
import { Prisma, Project } from '../generated/client';
@Injectable()
export class InspectionsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    private userService: UserService,
  ) {}

  async create(
    createInspectionDto: CreateInspectionDto,
    files: { buffer: string; originalname: string }[],
  ) {
    const photoUploadPromises = files.map((file) => {
      const fileBuffer = Buffer.from(file.buffer, 'base64');

      const mockFile = {
        buffer: fileBuffer,
        originalname: file.originalname,
      };

      return this.cloudinaryService.uploadImage(mockFile);
    });
    const uploadResults = await Promise.all(photoUploadPromises);
    const photoUrls = uploadResults.map((result) => result.secure_url);

    // 2. Create inspection with checklist and photos as Json
    const inspection = await this.prisma.inspection.create({
      data: {
        projectId: createInspectionDto.projectId,
        inspector: createInspectionDto.inspectorId, // Mapping inspectorId to inspector
        status: createInspectionDto.status,
        photos: photoUrls, // Stored as Json array
        checklist:
          createInspectionDto.checklist as unknown as Prisma.InputJsonValue, // Stored as Json
        isVisibleToClient: createInspectionDto.isVisibleToClient ?? false,
      },
    });

    return inspection;
  }

  async findAllForProject(
    projectId: number,
    pagination: { skip?: number; take?: number },
    user: AuthenticatedUser,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException('Project not found');

    const profile = await this.userService.getOrCreateProfile(user);
    if (profile.role === 'CLIENT' && project.clientId !== user.firebaseId) {
      throw new ForbiddenException(
        'You do not have permission to view inspections for this project.',
      );
    }
    if (
      profile.role === 'CONTRACTOR' &&
      project.contractorId !== user.firebaseId
    ) {
      throw new ForbiddenException(
        'You do not have permission to view inspections for this project.',
      );
    }

    const { skip = 0, take = 20 } = pagination;
    const where: Prisma.InspectionWhereInput = { projectId };
    if (profile.role === 'CLIENT') {
      where.isVisibleToClient = true;
    }

    return this.prisma.inspection.findMany({
      where,
      skip,
      take,
    });
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const inspection = await this.prisma.inspection.findUnique({
      where: { id },
      include: { Project: true },
    });

    if (!inspection) {
      throw new NotFoundException(`Inspection with ID ${id} not found.`);
    }

    const project = (inspection as unknown as { Project: Project }).Project;
    const profile = await this.userService.getOrCreateProfile(user);
    if (profile.role === 'CLIENT' && project.clientId !== user.firebaseId) {
      throw new ForbiddenException(
        'You do not have permission to view this inspection.',
      );
    }
    if (
      profile.role === 'CONTRACTOR' &&
      project.contractorId !== user.firebaseId
    ) {
      throw new ForbiddenException(
        'You do not have permission to view this inspection.',
      );
    }

    return inspection;
  }

  async update(
    id: number,
    updateInspectionDto: UpdateInspectionDto,
    user: AuthenticatedUser,
  ) {
    const _inspection = await this.findOne(id, user); // RBAC

    return this.prisma.inspection.update({
      where: { id },
      data: {
        ...updateInspectionDto,
        status: updateInspectionDto.status,
      } as Prisma.InspectionUpdateInput,
    });
  }

  async remove(id: number, user: AuthenticatedUser) {
    await this.findOne(id, user);
    return this.prisma.inspection.delete({
      where: { id },
    });
  }
}
