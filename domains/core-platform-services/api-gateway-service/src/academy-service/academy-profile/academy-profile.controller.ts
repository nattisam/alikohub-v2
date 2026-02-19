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

  // Delegate role selection to auth-service
  @Post('select-role')
  @ApiOperation({
    summary: 'Select academy role (student / teacher)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          enum: ['student', 'teacher'],
          example: 'student',
        },
      },
      required: ['role'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Role selection processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid role or validation failed',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to process role selection',
  })
  async selectRole(@Request() req: RequestWithUser, @Body() body: { role: string }) {
    // Convert role format for academy backend
    let academyRole: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
    switch (body.role.toLowerCase()) {
      case 'student':
        academyRole = 'STUDENT';
        break;
      case 'teacher':
      case 'instructor':
        academyRole = 'INSTRUCTOR';
        break;
      case 'admin':
        academyRole = 'ADMIN';
        break;
      default:
        throw new BadRequestException('Invalid role provided. Use student, teacher, or admin.');
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
    } catch (error: any) {
      const errMsg = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(
        'Failed to select role: ' + errMsg,
      );
    }
  }
}
