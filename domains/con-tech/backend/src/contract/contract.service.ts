import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Assuming you have this service
import { v2 as _cloudinary } from 'cloudinary';
import { ContractStatus, Prisma, Project } from '../generated/client';
import { AddChangeOrderDto } from './dto/add-change-order.dto';
import { AuthenticatedUser, UserService } from '../user/user.service';

interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class ContractService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService, // Inject your Cloudinary service
    private userService: UserService,
  ) {}

  async createContract(projectId: number, contractUrl: string) {
    // Validate URL
    try {
      new URL(contractUrl);
    } catch {
      throw new BadRequestException('Invalid contract URL');
    }

    // Save the metadata to the database
    return this.prisma.contract.create({
      data: {
        projectId,
        contractFile: contractUrl,
        status: 'DRAFT', // Initial status
        changeOrders: [], // Initial empty array
      },
    });
  }

  /**
   * Upload a contract file and create a contract record
   * Handles base64 encoded files from API Gateway
   */
  async uploadAndCreateContract(
    projectId: number,
    file: {
      buffer: string;
      originalname: string;
      mimetype: string;
      size: number;
    },
    _user: AuthenticatedUser,
  ) {
    // Verify project exists
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Decode base64 buffer
    const fileBuffer = Buffer.from(file.buffer, 'base64');

    // Create mock Multer file for Cloudinary upload
    const mockFile: MulterFile = {
      buffer: fileBuffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };

    // Upload to Cloudinary as raw file (for documents like PDFs)
    const uploadResult = await this.cloudinaryService.uploadRaw(mockFile, {
      folder: `contech/contracts/${projectId}`,
      public_id: `contract_${Date.now()}`,
    });

    // Create contract record with uploaded file URL
    return this.prisma.contract.create({
      data: {
        projectId,
        contractFile: uploadResult.secure_url,
        status: 'DRAFT',
        changeOrders: [],
      },
    });
  }

  async updateStatus(
    id: number,
    status: ContractStatus,
    user: AuthenticatedUser,
  ) {
    const _contract = await this.findContractById(id, user); // RBAC included

    // Extra check: Only Pm/Admin/Client can update status.
    // Contractor probably shouldn't update contract status.
    const profile = await this.userService.getOrCreateProfile(user);
    if (profile.role === 'CONTRACTOR') {
      throw new ForbiddenException(
        'Contractors cannot update contract status.',
      );
    }

    return this.prisma.contract.update({
      where: { id },
      data: { status },
    });
  }

  async addChangeOrder(
    id: number,
    changeOrderDto: AddChangeOrderDto,
    user: AuthenticatedUser,
  ) {
    const contract = await this.findContractById(id, user);

    return this.prisma.contract.update({
      where: { id },
      data: {
        changeOrders: [
          ...((contract.changeOrders as Prisma.JsonArray) || []),
          {
            ...changeOrderDto,
            createdAt: new Date().toISOString(),
          } as unknown as Prisma.JsonObject,
        ],
      },
    });
  }

  async generateSignedUrl(
    id: number,
    user: AuthenticatedUser,
  ): Promise<{ signedUrl: string }> {
    const contract = await this.findContractById(id, user);
    return { signedUrl: contract.contractFile };
  }

  async findByProjectId(projectId: number, user: AuthenticatedUser) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException('Project not found');

    const profile = await this.userService.getOrCreateProfile(user);
    if (profile.role === 'CLIENT' && project.clientId !== user.firebaseId) {
      throw new ForbiddenException(
        'You do not have permission to view contracts for this project.',
      );
    }
    if (
      profile.role === 'CONTRACTOR' &&
      project.contractorId !== user.firebaseId
    ) {
      throw new ForbiddenException(
        'You do not have permission to view contracts for this project.',
      );
    }

    return this.prisma.contract.findMany({
      where: { projectId },
    });
  }

  // Helper to prevent code duplication
  private async findContractById(id: number, user: AuthenticatedUser) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: { Project: true },
    });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found.`);
    }

    const project = (contract as unknown as { Project: Project }).Project;
    const profile = await this.userService.getOrCreateProfile(user);
    if (profile.role === 'CLIENT' && project.clientId !== user.firebaseId) {
      throw new ForbiddenException(
        'You do not have permission to access this contract.',
      );
    }
    if (
      profile.role === 'CONTRACTOR' &&
      project.contractorId !== user.firebaseId
    ) {
      throw new ForbiddenException(
        'You do not have permission to access this contract.',
      );
    }

    return contract;
  }
}
