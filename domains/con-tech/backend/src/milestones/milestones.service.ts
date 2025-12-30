import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { CreateMilestoneReviewDto } from './dto/create-milestone-review.dto';

@Injectable()
export class MilestonesService {
  constructor(private prisma: PrismaService) {}

  async create(createMilestoneDto: CreateMilestoneDto) {
    const milestone = await this.prisma.milestone.create({ data: createMilestoneDto });
    await this.updateProjectProgress(milestone.projectId);
    return milestone;
  }

  findAll(projectId: number) {
    return this.prisma.milestone.findMany({ where: { projectId } });
  }

  findOne(id: number) {
    return this.prisma.milestone.findUnique({ where: { id } });
  }

  update(id: number, updateMilestoneDto: UpdateMilestoneDto) {
    return this.prisma.milestone.update({
      where: { id },
      data: updateMilestoneDto,
    });
  }

  async remove(id: number) {
    const milestone = await this.prisma.milestone.findUnique({ where: { id } });
    if (milestone) {
      const deletedMilestone = await this.prisma.milestone.delete({ where: { id } });
      await this.updateProjectProgress(milestone.projectId);
      return deletedMilestone;
    }
    return null;
  }

  submitForReview(id: number) {
    return this.prisma.milestone.update({
      where: { id },
      data: { status: 'IN_REVIEW' },
    });
  }



  private async updateProjectProgress(projectId: number) {
    const milestones = await this.prisma.milestone.findMany({
      where: { projectId },
    });

    if (milestones.length === 0) {
      await this.prisma.project.update({
        where: { id: projectId },
        data: { progress: 0 },
      });
      return;
    }

    const approvedCount = milestones.filter(m => m.status === 'APPROVED').length;
    const progress = (approvedCount / milestones.length) * 100;

    await this.prisma.project.update({
      where: { id: projectId },
      data: { progress },
    });
  }
}
