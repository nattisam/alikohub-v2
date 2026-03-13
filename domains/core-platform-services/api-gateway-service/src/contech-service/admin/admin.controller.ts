import {
  Controller,
  Get,
  Post,
  Inject,
  Query,
  UseGuards,
  Request,
  Param,
  Patch,
  Body,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { AdminAccessGuard } from '../../common/guard/admin-access.guard';
import { RequestWithUser } from '../../common/types/request-with-user.interface';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('ConTech Admin')
@ApiBearerAuth()
@Controller('contech/admin')
@UseGuards(AuthGuard, AdminAccessGuard)
export class AdminController {
  constructor(@Inject('CONTECH_SERVICE') private contechClient: ClientProxy) {}

  @ApiOperation({ summary: 'Get Admin Dashboard stats' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved' })
  @Get('dashboard')
  getDashboard(@Request() req: RequestWithUser) {
    const payload = { user: req.user };
    return this.contechClient.send({ cmd: 'get_admin_dashboard' }, payload);
  }

  @ApiOperation({ summary: 'List ConTech users (Clients/Contractors)' })
  @ApiQuery({ name: 'role', enum: ['CLIENT', 'CONTRACTOR'], required: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @Get('users')
  listUsers(
    @Request() req: RequestWithUser,
    @Query('role') role: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const payload = { user: req.user, role, page, pageSize };
    return this.contechClient.send({ cmd: 'list_contech_users' }, payload);
  }

  @ApiOperation({ summary: 'Register a new ConTech user (Client/Contractor)' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @Post('users')
  registerUser(@Request() req: RequestWithUser, @Body() userData: any) {
    const payload = { user: req.user, ...userData };
    return this.contechClient.send({ cmd: 'register_contech_user' }, payload);
  }
}
