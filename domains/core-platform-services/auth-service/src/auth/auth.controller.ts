import {
  Controller,
  UsePipes,
  Logger,
  Post,
  Get,
  Body,
  Query,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import { SelectRoleDto, TeacherApplicationDto } from './dto/academy-roles.dto';
import * as Joi from 'joi';
import { JoiValidationPipe } from '../validation.pipe';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  healthCheckGet() {
    return {
      status: 'up',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('health')
  @MessagePattern({ cmd: 'health_check' })
  healthCheckPost() {
    return {
      status: 'up',
      service: 'auth-service',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('register')
  @MessagePattern({ cmd: 'register' })
  @UsePipes(
    new JoiValidationPipe(
      Joi.object({
        email: Joi.string().email().required().trim(),
        firstname: Joi.string()
          .required()
          .pattern(/^[A-Za-z\s]+$/)
          .trim()
          .messages({
            'string.pattern.base':
              'firstname must contain only alphabetic characters',
          }),
        lastname: Joi.string()
          .optional()
          .allow(null, '')
          .pattern(/^[A-Za-z\s]*$/)
          .trim()
          .messages({
            'string.pattern.base':
              'lastname must contain only alphabetic characters',
          }),
        password: Joi.string()
          .min(8)
          .regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
          .required(),
      }),
    ),
  )
  async register(@Body() dto: SignUpDto, @Payload() payload: SignUpDto) {
    return this.authService.register(dto || payload);
  }

  @Post('create-recruiter')
  @MessagePattern({ cmd: 'create_recruiter' })
  @UsePipes(
    new JoiValidationPipe(
      Joi.object({
        email: Joi.string().email().required().trim(),
        firstname: Joi.string()
          .required()
          .pattern(/^[A-Za-z\s]+$/)
          .trim()
          .messages({
            'string.pattern.base':
              'firstname must contain only alphabetic characters',
          }),
        lastname: Joi.string()
          .optional()
          .allow(null, '')
          .pattern(/^[A-Za-z\s]*$/)
          .trim()
          .messages({
            'string.pattern.base':
              'lastname must contain only alphabetic characters',
          }),
        password: Joi.string()
          .min(8)
          .regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
          .required(),
      }),
    ),
  )
  async createRecruiter(@Body() dto: any, @Payload() payload: any) {
    return this.authService.createRecruiter(dto || payload);
  }

  @Post('create-contech-user')
  @MessagePattern({ cmd: 'create_contech_user' })
  @UsePipes(
    new JoiValidationPipe(
      Joi.object({
        email: Joi.string().email().required().trim(),
        firstname: Joi.string()
          .required()
          .pattern(/^[A-Za-z\s]+$/)
          .trim()
          .messages({
            'string.pattern.base':
              'firstname must contain only alphabetic characters',
          }),
        lastname: Joi.string()
          .optional()
          .allow(null, '')
          .pattern(/^[A-Za-z\s]*$/)
          .trim()
          .messages({
            'string.pattern.base':
              'lastname must contain only alphabetic characters',
          }),
        password: Joi.string()
          .min(8)
          .regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
          .required(),
        role: Joi.string().valid('ADMIN', 'CONTRACTOR', 'CLIENT').required(),
      }),
    ),
  )
  async createContechUser(@Body() dto: any, @Payload() payload: any) {
    return this.authService.createContechUser(dto || payload);
  }

  @Post('create-events-user')
  @MessagePattern({ cmd: 'create_events_user' })
  @UsePipes(
    new JoiValidationPipe(
      Joi.object({
        email: Joi.string().email().required().trim(),
        firstname: Joi.string()
          .required()
          .pattern(/^[A-Za-z\s]+$/)
          .trim()
          .messages({
            'string.pattern.base':
              'firstname must contain only alphabetic characters',
          }),
        lastname: Joi.string()
          .optional()
          .allow(null, '')
          .pattern(/^[A-Za-z\s]*$/)
          .trim()
          .messages({
            'string.pattern.base':
              'lastname must contain only alphabetic characters',
          }),
        password: Joi.string()
          .min(8)
          .regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
          .required(),
        role: Joi.string().valid('ADMIN', 'CONTENT_MANAGER', 'USER').required(),
      }),
    ),
  )
  async createEventsUser(@Body() dto: any, @Payload() payload: any) {
    return this.authService.createEventsUser(dto || payload);
  }

  @Post('login')
  @MessagePattern({ cmd: 'login' })
  @UsePipes(
    new JoiValidationPipe(
      Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
      }),
    ),
  )
  async login(@Body() dto: SignInDto, @Payload() payload: SignInDto) {
    return this.authService.login(dto || payload);
  }

  @Post('login-google')
  @MessagePattern({ cmd: 'login_google' })
  @UsePipes(
    new JoiValidationPipe(
      Joi.object({
        idToken: Joi.string().required(),
      }),
    ),
  )
  async loginWithGoogle(
    @Body() body: { idToken: string },
    @Payload() payload: { idToken: string },
  ) {
    const token = body?.idToken || payload?.idToken;
    return this.authService.loginWithGoogle(token);
  }

  @Post('verify')
  @MessagePattern({ cmd: 'verify' })
  async verify(
    @Body() dto: { type: 'cookie' | 'token'; value: string },
    @Payload() payload: { type: 'cookie' | 'token'; value: string },
  ) {
    return this.authService.verifyAuth(dto || payload);
  }

  @Post('create-session')
  @MessagePattern({ cmd: 'create_session' })
  async createSession(
    @Body() dto: { idToken: string; expiresIn?: number },
    @Payload() payload: { idToken: string; expiresIn?: number },
  ) {
    const data = dto || payload;
    return this.authService.createSessionCookie(data.idToken, data.expiresIn);
  }

  @Post('academy/select-role')
  @MessagePattern({ cmd: 'select_academy_role' })
  @UsePipes(
    new JoiValidationPipe(
      Joi.object({
        userId: Joi.string().required(),
        role: Joi.string()
          .valid('student', 'teacher', 'instructor')
          .required()
          .lowercase(),
      }),
    ),
  )
  async handleSelectRole(
    @Body() dto: SelectRoleDto,
    @Payload() payload: SelectRoleDto,
  ) {
    const data = dto || payload;
    try {
      return await this.authService.selectAcademyRole(data.userId, data.role);
    } catch (error) {
      this.logger.error(
        `Error in select_academy_role: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post('academy/apply-teacher')
  @MessagePattern({ cmd: 'apply_teacher_role' })
  async handleTeacherApplication(
    @Body() dto: TeacherApplicationDto,
    @Payload() payload: TeacherApplicationDto,
  ) {
    try {
      return await this.authService.applyForTeacherRole(dto || payload);
    } catch (error) {
      this.logger.error(
        `Error in apply_teacher_role: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Post('academy/teacher-applications')
  @MessagePattern({ cmd: 'get_teacher_applications' })
  async handleGetTeacherApplications(
    @Query() query: { requestingUserRole?: string },
    @Payload() payload: { requestingUserRole?: string },
  ) {
    const role = query?.requestingUserRole || payload?.requestingUserRole;
    return this.authService.getTeacherApplications(role);
  }

  @Post('academy/approve-teacher')
  @MessagePattern({ cmd: 'approve_teacher_application' })
  async handleApproveTeacher(@Body() dto: any, @Payload() payload: any) {
    const data = dto || payload;
    return this.authService.approveTeacherApplication(
      data.applicationId,
      data.requestingUserRole,
      data.reviewerId,
      data.reviewNotes,
    );
  }

  @Post('academy/reject-teacher')
  @MessagePattern({ cmd: 'reject_teacher_application' })
  async handleRejectTeacher(@Body() dto: any, @Payload() payload: any) {
    const data = dto || payload;
    return this.authService.rejectTeacherApplication(
      data.applicationId,
      data.requestingUserRole,
      data.reviewerId,
      data.reviewNotes,
    );
  }

  @Post('academy/switch-role')
  @MessagePattern({ cmd: 'switch_role' })
  @UsePipes(
    new JoiValidationPipe(
      Joi.object({
        userId: Joi.string().required(),
        newRole: Joi.string()
          .valid('student', 'teacher', 'instructor')
          .required()
          .lowercase(),
      }),
    ),
  )
  async handleSwitchRole(
    @Body() dto: { userId: string; newRole: string },
    @Payload() payload: { userId: string; newRole: string },
  ) {
    const data = dto || payload;
    try {
      return await this.authService.switchRole(data.userId, data.newRole);
    } catch (error) {
      this.logger.error(`Error in switch_role: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('academy/status')
  @MessagePattern({ cmd: 'get_user_academy_status' })
  async handleGetUserStatus(
    @Body() dto: { userId: string },
    @Payload() payload: { userId: string },
  ) {
    const data = dto || payload;
    return this.authService.getUserAcademyStatus(data.userId);
  }

  @Post('sync/contech')
  @MessagePattern({ cmd: 'sync_contech_user' })
  async handleSyncContechUser(
    @Body() dto: { userId: string },
    @Payload() payload: { userId: string },
  ) {
    const data = dto || payload;
    return this.authService.syncContechUser(data.userId);
  }

  @Post('sync/events')
  @MessagePattern({ cmd: 'sync_events_user' })
  async handleSyncEventsUser(
    @Body() dto: { userId: string },
    @Payload() payload: { userId: string },
  ) {
    const data = dto || payload;
    return this.authService.syncEventsUser(data.userId);
  }

  @Post('sync/academy')
  @MessagePattern({ cmd: 'sync_academy_user' })
  async handleSyncAcademyUser(
    @Body() dto: { userId: string },
    @Payload() payload: { userId: string },
  ) {
    const data = dto || payload;
    return this.authService.syncAcademyUser(data.userId);
  }

  @Post('contact/email')
  @MessagePattern({ cmd: 'send_contact_email' })
  async handleSendContactEmail(@Body() dto: any, @Payload() payload: any) {
    return this.authService.sendContactEmail(dto || payload);
  }

  @Patch('user/status')
  @MessagePattern({ cmd: 'update_status' })
  async handleUpdateStatus(
    @Body() dto: { firebaseId: string; status: string },
    @Payload() payload: { firebaseId: string; status: string },
  ) {
    const data = dto || payload;
    return this.authService.updateStatus(data.firebaseId, data.status);
  }

  @Delete('user')
  @MessagePattern({ cmd: 'delete_user' })
  async handleDeleteUser(
    @Body() dto: { firebaseId: string },
    @Payload() payload: { firebaseId: string },
  ) {
    const firebaseId = dto?.firebaseId || payload?.firebaseId;
    return this.authService.deleteUser(firebaseId);
  }
}
