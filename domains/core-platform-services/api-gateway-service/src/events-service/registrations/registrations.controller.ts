import {
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { RequestWithUser } from '../../common/types/request-with-user.interface';

@Controller('admin/events')
@UseGuards(AuthGuard)
export class RegistrationsController {
    constructor(@Inject('EVENTS_SERVICE') private eventsClient: ClientProxy) { }

    @Get(':eventId/registrations')
    findAllRegistrations(@Request() req: RequestWithUser, @Param('eventId') eventId: string) {
        const payload = {
            eventId,
            user: req.user
        };
        return this.eventsClient.send({ cmd: 'find_all_registrations' }, payload);
    }

    @Delete(':eventId/registrations/:registrationId')
    removeRegistration(@Request() req: RequestWithUser, @Param('eventId') eventId: string, @Param('registrationId') registrationId: string) {
        const payload = {
            eventId,
            registrationId,
            user: req.user,
        };
        return this.eventsClient.send({ cmd: 'remove_registration' }, payload);
    }
}