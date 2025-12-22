import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Assuming you have this service
import { v2 as cloudinary } from 'cloudinary';
import { ContractStatus } from '@prisma/client';
import { AddChangeOrderDto } from './dto/add-change-order.dto';

@Injectable()
export class ContractService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService, // Inject your Cloudinary service
  ) { }

  async uploadAndCreateContract(
    projectId: number,
    fileBuffer: Buffer,
    originalName: string,
  ) {
    // 1. Upload the file to Cloudinary as a private raw file
    const uploadResult = await this.cloudinaryService.uploadRaw(fileBuffer, {
      resource_type: 'raw', // Important for non-image files
      type: 'private',      // Important for security
      public_id: `contracts/${projectId}/${Date.now()}-${originalName}`, // Organized folder structure
    });

    // 2. Save the metadata to the database
    return this.prisma.contract.create({
      data: {
        projectId,
        fileName: originalName,
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        status: ContractStatus.DRAFT, // Initial status
      },
    });
  }

  async updateStatus(id: number, status: ContractStatus) {
    await this.findContractById(id); // Ensure contract exists
    return this.prisma.contract.update({
      where: { id },
      data: { status },
    });
  }

  async addChangeOrder(id: number, changeOrderDto: AddChangeOrderDto) {
    const contract = await this.findContractById(id);

    // Safely append to the JSON array
    const existingOrders = (contract.changeOrders as any[]) || [];
    const newChangeOrders = [...existingOrders, {
      ...changeOrderDto,
      createdAt: new Date().toISOString(),
    }];

    return this.prisma.contract.update({
      where: { id },
      data: { changeOrders: newChangeOrders },
    });
  }

  async generateSignedUrl(id: number): Promise<{ signedUrl: string }> {
    const contract = await this.findContractById(id);

    // Generate a URL that is valid for 10 minutes
    const signedUrl = cloudinary.utils.private_download_url(contract.publicId, 'pdf', {
      resource_type: 'raw',
      type: 'private',
      expires_at: Math.floor(Date.now() / 1000) + (60 * 10), // 10 minutes from now
    });

    return { signedUrl };
  }

  async findByProjectId(projectId: number) {
    return this.prisma.contract.findMany({
      where: { projectId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  // Helper to prevent code duplication
  private async findContractById(id: number) {
    const contract = await this.prisma.contract.findUnique({ where: { id } });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found.`);
    }
    return contract;
  }
}