import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InspectionsService } from './inspections.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';


@Controller()
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @MessagePattern({cmd: 'create_Inspection'})
  create(@Payload() payload) {
    const {dto, files} = payload
    return this.inspectionsService.create(dto, files);
  }

  @MessagePattern({cmd: 'findAllInspections'})
  async findAll(@Payload() data: { projectId: number; pagination?: { skip?: number; take?: number } }) {
    const { projectId, pagination = {} } = data;
    return this.inspectionsService.findAllForProject(projectId, pagination);
  }

  @MessagePattern({cmd: 'findOneInspection'})
  async findOne(@Payload() id: number) {
    return this.inspectionsService.findOne(id);
  }

  @MessagePattern({cmd:'updateInspection'})
  async update(@Payload() updateInspectionDto: UpdateInspectionDto) {
    return this.inspectionsService.update(updateInspectionDto.id, updateInspectionDto);
  }

  @MessagePattern({cmd:'removeInspection'})
  async remove(@Payload() id: number) {
    return this.inspectionsService.remove(id);
  }
}
