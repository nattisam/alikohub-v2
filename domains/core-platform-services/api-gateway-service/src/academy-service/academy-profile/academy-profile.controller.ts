import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '../../common/guard';
import { lastValueFrom } from 'rxjs';
import { RequestWithUser } from '../../common/types/request-with-user.interface';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

// Define the enum to match the backend
enum AcademyRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
}

@ApiTags('Academy Profile')
@ApiBearerAuth()
@Controller('academy/profile')
@UseGuards(AuthGuard)
export class AcademyProfileController {
  constructor(@Inject('ACADEMY_SERVICE') private academyClient: ClientProxy) {}

  @Get()
  @ApiOperation({ summary: 'Get academy profile of logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'Academy profile returned successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to get profile',
  })
  async getProfile(@Request() req: RequestWithUser) {
    const payload = { user: req.user };
    try {
      return await lastValueFrom(
        this.academyClient.send({ cmd: 'get_academy_profile' }, payload),
      );
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(
        'Failed to get profile: ' + errMsg,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create academy profile for logged-in user' })
  @ApiResponse({
    status: 201,
    description: 'Academy profile created successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to create profile',
  })
  async createProfile(@Request() req: RequestWithUser) {
    const payload = { user: req.user };
    try {
      return await lastValueFrom(
        this.academyClient.send({ cmd: 'create_academy_profile' }, payload),
      );
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(
        'Failed to create profile: ' + errMsg,
      );
    }
  }

  // New endpoint for role selection
  @Post('select-role')
  @ApiOperation({
    summary: 'Select academy role (STUDENT / INSTRUCTOR / ADMIN)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          enum: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
          example: 'STUDENT',
        },
      },
      required: ['role'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Academy role selected successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid role provided',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to select role',
  })
  async selectRole(@Request() req: RequestWithUser, @Body() body: { role: string }) {
    const role = body.role;

    let academyRole: AcademyRole;
    switch (role) {
      case 'STUDENT':
        academyRole = AcademyRole.STUDENT;
        break;
      case 'INSTRUCTOR':
        academyRole = AcademyRole.INSTRUCTOR;
        break;
      case 'ADMIN':
        academyRole = AcademyRole.ADMIN;
        break;
      default:
        throw new BadRequestException('Invalid role provided');
    }

    const payload = {
      user: req.user,
      userId: req.user?.firebaseId,
      role: academyRole,
    };

    try {
      return await lastValueFrom(
        this.academyClient.send({ cmd: 'select_academy_role' }, payload),
      );
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(
        'Failed to select role: ' + errMsg,
      );
    }
  }
}
