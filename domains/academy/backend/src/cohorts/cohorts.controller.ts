import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CohortsService } from './cohorts.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { AuthenticatedUser } from 'src/user/user.service';
import { AcademyProfileGuard } from 'src/auth';
import { RoleGuard } from 'src/auth/role-guard/role-guard';
import { Roles } from 'src/auth/role-guard/roles.decorator';



@Controller()
@UseGuards(AcademyProfileGuard)
export class CohortsController {
  constructor(private readonly cohortsService: CohortsService) {}

  @MessagePattern({ cmd: 'create_cohort' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async create(@Payload() payload: { dto: CreateCohortDto; user: AuthenticatedUser }) {
    return this.cohortsService.create(payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'find_all_cohorts' })
  async findAll(@Payload() payload: { courseId?: number }) {
    return this.cohortsService.findAll(payload.courseId);
  }

  @MessagePattern({ cmd: 'find_cohort_by_id' })
  async findOne(@Payload() payload: { id: number }) {
    return this.cohortsService.findOne(payload.id);
  }

  @MessagePattern({ cmd: 'update_cohort' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async update(@Payload() payload: { id: number; dto: UpdateCohortDto; user: AuthenticatedUser }) {
    return this.cohortsService.update(payload.id, payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'remove_cohort' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  async remove(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return this.cohortsService.remove(payload.id, payload.user);
  }
}