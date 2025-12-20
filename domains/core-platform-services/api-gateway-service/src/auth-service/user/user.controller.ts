import { Controller, Get, Inject, UseGuards, Request, Body, Patch, Delete, Param, ForbiddenException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../../../common/guard/firebase_auth.guard';
import { Roles } from '../../../common/roles/roles.decorator';
import { RoleGuard } from '../../../common/roles/roles.guard';
import { GlobalRole } from '../../../common/roles/roles.enum';
import { UpdateUserDto } from './dto/update-user.dto';

interface AuthenticatedRequest extends Request {
    user: {
        firebaseId: string;
        globalRole: GlobalRole;
    };
}

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
    constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

    @Get('all')
    @UseGuards(RoleGuard)
    @Roles(GlobalRole.ADMIN)
    getAllUsers(@Request() req: AuthenticatedRequest) {
        return this.authClient.send({ cmd: 'get_all_users' }, { requestingUser: req.user });
    }

    @Get('profile')
    getProfile(@Request() req: AuthenticatedRequest) {
        return this.authClient.send({ cmd: 'get_user_profile' }, { firebaseId: req.user.firebaseId });
    }

    @Patch('profile')
    updateProfile(@Request() req: AuthenticatedRequest, @Body() dto: UpdateUserDto) {
        const payload = { firebaseId: req.user.firebaseId, dto };
        return this.authClient.send({ cmd: 'update_user_profile' }, payload);
    }

    @Patch(':id')
    updateUserById(@Request() req: AuthenticatedRequest, @Param('id') id: string, @Body() dto: UpdateUserDto) {
        if (req.user.firebaseId !== id && req.user.globalRole !== GlobalRole.ADMIN) {
            throw new ForbiddenException('You can only update your own profile');
        }
        const payload = { firebaseId: id, dto };
        return this.authClient.send({ cmd: 'update_user_by_id' }, payload);
    }

    @Delete('profile')
    deleteProfile(@Request() req: AuthenticatedRequest) {
        return this.authClient.send({ cmd: 'delete_user_profile' }, { firebaseId: req.user.firebaseId });
    }
}
