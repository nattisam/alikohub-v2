import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ContactService } from './contact.service';

@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @MessagePattern({ cmd: 'send_contact_inquiry' })
  async handleContactInquiry(@Payload() dto: { name: string; email: string; phone: string; message: string }) {
    return await this.contactService.sendContactEmail(dto);
  }
}
