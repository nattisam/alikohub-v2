import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AssignRoleDto } from './dto/assign-role.dto';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { RequestWithUser } from '../../common/types/request-with-user.interface';

@Controller('events')
@UseGuards(AuthGuard)
export class RolesController {
    constructor(@Inject('EVENTS_SERVICE') private eventsClient: ClientProxy) { }

    @Post('assign-role')
    assignRole(@Request() req: RequestWithUser, @Body() assignRoleDto: AssignRoleDto) {
        const payload = {
            dto: assignRoleDto,
            user: req.user,
        };
        return this.eventsClient.send({ cmd: 'assign_role' }, payload);
    }

    @Get('user-role')
    getUserRole(@Request() req: RequestWithUser) {
        const payload = {
            user: req.user,
        };
        return this.eventsClient.send({ cmd: 'get_user_role' }, payload);
    }

    @Get('profile')
    getProfile(@Request() req: RequestWithUser) {
        const payload = {
            user: req.user,
        };
        return this.eventsClient.send({ cmd: 'get_events_profile' }, payload);
    }
}