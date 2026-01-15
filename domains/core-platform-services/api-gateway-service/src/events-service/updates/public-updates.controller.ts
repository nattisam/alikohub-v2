import {
    Controller,
    Get,
    Inject,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { RequestWithUser } from '../../common/types/request-with-user.interface';

@Controller('updates')
@UseGuards(AuthGuard)
export class PublicUpdatesController {
    constructor(@Inject('EVENTS_SERVICE') private eventsClient: ClientProxy) { }

    @Get()
    findAllUpdates(@Request() req: RequestWithUser) {
        const payload = {
            user: req.user
        };
        return this.eventsClient.send({ cmd: 'find_all_updates' }, payload);
    }

    @Get(':id')
    findUpdateById(@Request() req: RequestWithUser, @Param('id') id: string) {
        const payload = { id, user: req.user };
        return this.eventsClient.send({ cmd: 'find_update_by_id' }, payload);
    }
}