// src/client-reports/client-reports.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ClientReportService } from './client-report.service';
import { CreateClientReportDto } from './dto/create-client-report.dto';
import { AuthenticatedUser } from '../user/user.service';

@Controller()
export class ClientReportController {
  constructor(private readonly clientReportsService: ClientReportService) {}

  @MessagePattern({ cmd: 'createClientReport' })
  create(
    @Payload() payload: { dto: CreateClientReportDto; user: AuthenticatedUser },
  ) {
    return this.clientReportsService.create(payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'findAllClientReportsByProjectId' })
  findAllByProjectId(@Payload() projectId: number) {
    return this.clientReportsService.findAllByProjectId(projectId);
  }

  @MessagePattern({ cmd: 'findOneClientReportById' })
  findOneById(@Payload() reportId: number) {
    return this.clientReportsService.findOneById(reportId);
  }
}
