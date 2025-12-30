import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Your Prisma service
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Your Cloudinary service
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { MulterFile } from 'multer';
@Injectable()
export class InspectionsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createInspectionDto: CreateInspectionDto, files: any[]) {
    const photoUploadPromises = files.map((file) => {
      const fileBuffer = Buffer.from(file.buffer, 'base64');
      
      const mockFile = {
        buffer: fileBuffer,
        originalname: file.originalname,
      } as MulterFile; // Create a mock file object for the service

      return this.cloudinaryService.uploadImage(mockFile);
    });
    const uploadResults = await Promise.all(photoUploadPromises);
    const photoUrls = uploadResults.map((result) => result.secure_url);

    // 2. Create inspection with checklist and photos as Json
    const inspection = await this.prisma.inspection.create({
      data: {
        projectId: createInspectionDto.projectId,
        inspector: createInspectionDto.inspectorId, // Mapping inspectorId to inspector
        status: createInspectionDto.status as string,
        photos: photoUrls, // Stored as Json array
        checklist: createInspectionDto.checklist as any, // Stored as Json
      },
    });

    return inspection;
  }

  async findAllForProject(projectId: number, pagination: { skip?: number; take?: number }) {
    const { skip = 0, take = 20 } = pagination;
    return this.prisma.inspection.findMany({
      where: { projectId },
      skip,
      take,
    });
  }

  async findOne(id: number) {
    const inspection = await this.prisma.inspection.findUnique({
      where: { id },
    });

    if (!inspection) {
      throw new NotFoundException(`Inspection with ID ${id} not found.`);
    }
    return inspection;
  }

  async update(id: number, updateInspectionDto: UpdateInspectionDto) {
    await this.findOne(id);

    return this.prisma.inspection.update({
      where: { id },
      data: {
        ...updateInspectionDto,
        status: updateInspectionDto.status as string,
      } as any,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.inspection.delete({
      where: { id },
    });
  }
}