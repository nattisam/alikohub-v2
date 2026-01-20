import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async createContract(
    projectId: number,
    contractUrl: string,
  ) {
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

  async updateStatus(id: number, status: string) {
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

    // Since publicId is not in the schema anymore, we might need a workaround or just use the secureUrl
    // For now, I'll return the contractFile as the signedUrl if we can't generate a real one without publicId
    return { signedUrl: contract.contractFile };
  }

  async findByProjectId(projectId: number) {
    return this.prisma.contract.findMany({
      where: { projectId },
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