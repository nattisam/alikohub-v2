import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ClientReportService } from './client-report.service';
import { CreateClientReportDto } from './dto/create-client-report.dto';
import { AuthenticatedUser } from '../user/user.service';
import { ConTechProfileGuard, RoleGuard, Roles } from '../auth';

@Controller()
@UseGuards(ConTechProfileGuard)
export class ClientReportController {
  constructor(private readonly clientReportsService: ClientReportService) {}

  @MessagePattern({ cmd: 'createClientReport' })
  @UseGuards(RoleGuard)
  @Roles('PROJECT_MANAGER', 'ADMIN')
  create(
    @Payload() payload: { dto: CreateClientReportDto; user: AuthenticatedUser },
  ) {
    return this.clientReportsService.create(payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'findAllClientReportsByProjectId' })
  findAllByProjectId(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return this.clientReportsService.findAllByProjectId(payload.id, payload.user);
  }

  @MessagePattern({ cmd: 'findOneClientReportById' })
  findOneById(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return this.clientReportsService.findOneById(payload.id, payload.user);
  }
}
