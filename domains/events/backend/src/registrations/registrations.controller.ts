import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Controller('events')
export class RegistrationsController {
    constructor(private readonly registrationsService: RegistrationsService) { }

    @MessagePattern({ cmd: 'create_registration' })
    create(@Payload() payload: any) {
        const { eventId, dto, user } = payload;
        return this.registrationsService.create(eventId, dto);
    }

    @MessagePattern({ cmd: 'find_all_registrations' })
    findAll(@Payload() payload: any) {
        const { eventId, user } = payload;
        return this.registrationsService.findAll(eventId);
    }

    @MessagePattern({ cmd: 'remove_registration' })
    remove(@Payload() payload: any) {
        const { eventId, registrationId, user } = payload;
        return this.registrationsService.remove(eventId, registrationId);
    }
}