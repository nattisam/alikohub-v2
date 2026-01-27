import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InspectionsService } from './inspections.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { AuthenticatedUser } from '../user/user.service';
import { ConTechProfileGuard, RoleGuard, Roles } from '../auth';


@Controller()
@UseGuards(ConTechProfileGuard)
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @MessagePattern({cmd: 'create_Inspection'})
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  create(@Payload() payload: { dto: CreateInspectionDto; files: any[]; user: AuthenticatedUser }) {
    const {dto, files} = payload
    // You might want to pass user to service if needed, currently not used in service based on previous signature
    return this.inspectionsService.create(dto, files);
  }

  @MessagePattern({cmd: 'findAllInspections'})
  async findAll(@Payload() data: { projectId: number; pagination?: { skip?: number; take?: number }; user: AuthenticatedUser }) {
    const { projectId, pagination = {}, user } = data;
    return this.inspectionsService.findAllForProject(projectId, pagination, user);
  }

  @MessagePattern('findOneInspection')
  async findOne(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return this.inspectionsService.findOne(payload.id, payload.user);
  }

  @MessagePattern('updateInspection')
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  async update(@Payload() payload: { id: number; updateInspectionDto: UpdateInspectionDto; user: AuthenticatedUser }) {
    // Note: Gateway says payload = { user, id, updateInspectionDto }
    // Backend expected updateInspectionDto to contain id before. The gateway sends id separately.
    // We should merge or simply use payload.id
    
    // Check if updateInspectionDto has id, if not use payload.id
    const dto = { ...payload.updateInspectionDto, id: payload.id };
    return this.inspectionsService.update(dto.id, dto, payload.user);
  }

  @MessagePattern('removeInspection')
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  async remove(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return this.inspectionsService.remove(payload.id, payload.user);
  }
}
