import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Put,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { RequestWithUser } from '../../common/types/request-with-user.interface';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';

@Controller('admin/updates')
@UseGuards(AuthGuard)
export class UpdatesController {
    constructor(@Inject('EVENTS_SERVICE') private eventsClient: ClientProxy) { }

    @Post()
    createUpdate(@Request() req: RequestWithUser, @Body() createUpdateDto: CreateUpdateDto) {
        const payload = {
            dto: createUpdateDto,
            user: req.user,
        };
        return this.eventsClient.send({ cmd: 'create_update' }, payload);
    }

    @Put(':id')
    updateUpdate(@Request() req: RequestWithUser, @Param('id') id: string, @Body() updateUpdateDto: UpdateUpdateDto) {
        const payload = {
            id,
            dto: updateUpdateDto,
            user: req.user,
        };
        return this.eventsClient.send({ cmd: 'update_update' }, payload);
    }

    @Delete(':id')
    removeUpdate(@Request() req: RequestWithUser, @Param('id') id: string) {
        const payload = {
            id,
            user: req.user,
        };
        return this.eventsClient.send({ cmd: 'remove_update' }, payload);
    }
}