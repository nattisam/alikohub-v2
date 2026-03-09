import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { Prisma } from '../generated/client';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { resolvePayload } from '../common/utils/payload-resolver.util';

@Controller('contact-submissions')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @MessagePattern({ cmd: 'create_contact_submission' })
  @Post()
  create(
    @Body() data: Prisma.ContactSubmissionCreateInput,
    @Payload() payload: Prisma.ContactSubmissionCreateInput,
  ) {
    return this.contactService.create(resolvePayload(data, payload));
  }

  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: Prisma.ContactSubmissionUpdateInput,
  ) {
    return this.contactService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
