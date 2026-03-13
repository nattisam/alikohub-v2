import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/client';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  // AvailabilityRule CRUD
  async createRule(data: Prisma.AvailabilityRuleCreateInput) {
    return this.prisma.availabilityRule.create({ data });
  }

  async findAllRules() {
    return this.prisma.availabilityRule.findMany();
  }

  async findOneRule(id: string) {
    return this.prisma.availabilityRule.findUnique({ where: { id } });
  }

  async updateRule(id: string, data: Prisma.AvailabilityRuleUpdateInput) {
    return this.prisma.availabilityRule.update({ where: { id }, data });
  }

  async removeRule(id: string) {
    return this.prisma.availabilityRule.delete({ where: { id } });
  }

  // TimeBlock CRUD
  async createTimeBlock(data: Prisma.TimeBlockCreateInput) {
    return this.prisma.timeBlock.create({ data });
  }

  async findAllTimeBlocks() {
    return this.prisma.timeBlock.findMany();
  }

  async findOneTimeBlock(id: string) {
    return this.prisma.timeBlock.findUnique({ where: { id } });
  }

  async updateTimeBlock(id: string, data: Prisma.TimeBlockUpdateInput) {
    return this.prisma.timeBlock.update({ where: { id }, data });
  }

  async removeTimeBlock(id: string) {
    return this.prisma.timeBlock.delete({ where: { id } });
  }
}
