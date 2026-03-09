import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Prisma, ApplicationStatus } from '../generated/client';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  resolvePayload,
  resolveParam,
} from '../common/utils/payload-resolver.util';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @MessagePattern({ cmd: 'create_application' })
  @Post()
  create(
    @Body() data: Omit<Prisma.ApplicationCreateInput, 'applicationCode'>,
    @Payload() payload: any,
  ) {
    const resolvedData = resolvePayload(data, payload);
    return this.applicationService.create(resolvedData);
  }

  @MessagePattern({ cmd: 'get_application' })
  @Get(':id')
  findOne(@Param('id') id: string, @Payload() payload: { id: string }) {
    return this.applicationService.findOne(resolveParam(id, payload?.id));
  }

  @MessagePattern({ cmd: 'get_user_applications' })
  handleGetUserApplications(@Payload() payload: { userId: string }) {
    return this.applicationService.findByUserId(payload.userId);
  }

  @MessagePattern({ cmd: 'update_application_status' })
  @Patch(':id/status')
  updateStatus(
    @Payload()
    payload: {
      id: string;
      status: ApplicationStatus;
      notes?: string;
      changedBy?: string;
    },
    @Param('id') id?: string,
    @Body('status') status?: ApplicationStatus,
    @Body('notes') notes?: string,
    @Body('changedBy') changedBy?: string,
  ) {
    return this.applicationService.updateStatus(
      resolveParam(id, payload.id),
      resolveParam(status, payload.status),
      resolveParam(notes, payload.notes),
      resolveParam(changedBy, payload.changedBy),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationService.remove(id);
  }

  @Post('documents')
  addDocument(@Body() data: Prisma.ApplicationDocumentCreateInput) {
    return this.applicationService.addDocument(data);
  }

  @Get(':id/documents')
  findDocuments(@Param('id') applicationId: string) {
    return this.applicationService.findDocuments(applicationId);
  }

  @Delete('documents/:id')
  removeDocument(@Param('id') id: string) {
    return this.applicationService.removeDocument(id);
  }
}
