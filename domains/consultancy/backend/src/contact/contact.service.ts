import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/client';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ContactSubmissionCreateInput) {
    return this.prisma.contactSubmission.create({ data });
  }

  async findAll() {
    return this.prisma.contactSubmission.findMany();
  }

  async findOne(id: string) {
    return this.prisma.contactSubmission.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.ContactSubmissionUpdateInput) {
    return this.prisma.contactSubmission.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.contactSubmission.delete({ where: { id } });
  }
}
