import { Controller, Post, Get, Inject, Body, HttpCode, HttpStatus, Param, HttpException, Logger, Res, UseGuards, Request, ForbiddenException, BadRequestException, UsePipes } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthGuard } from '../common/guard/firebase_auth.guard';
import { RoleGuard } from '../common/roles/roles.guard';
import { AdminAccessGuard } from '../common/guard/admin-access.guard';
import { Roles } from '../common/roles/roles.decorator';
import { CaptchaService } from '../common/captcha/captcha.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SelectRoleDto, TeacherApplicationDto, SwitchRoleDto } from './dto/academy-roles.dto';
import { catchError, timeout } from 'rxjs/operators';
import { throwError, TimeoutError, firstValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    private readonly captchaService: CaptchaService,
  ) {}

  private handleError(error: any, operation: string) {
    this.logger.error(`${operation} failed:`, error);
    
    if (error instanceof TimeoutError) {
      throw new HttpException('Auth service timeout', HttpStatus.GATEWAY_TIMEOUT);
    }
    
    if (error.code === 'ECONNREFUSED') {
      throw new HttpException('Auth service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }

    let status = HttpStatus.BAD_REQUEST;
    if (typeof error?.statusCode === 'number') {
      status = error.statusCode;
    } else if (typeof error?.status === 'number') {
      status = error.status;
    }

    const message = error?.message || 'Error from microservice';
    const errorType = error?.error || 'Microservice Error';

    throw new HttpException({
      statusCode: status,
      message,
      error: errorType,
      details: error?.details || error?.stack || null
    }, status);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @UsePipes(new JoiValidationPipe(Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required()
  })))
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt for: ${loginDto.email}`);
    
    return firstValueFrom(
      this.authClient.send({ cmd: 'login' }, loginDto).pipe(
        timeout(30000),
        catchError(error => {
          this.handleError(error, 'Login');
          return throwError(() => error);
        }),
      )
    );
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @UsePipes(new JoiValidationPipe(Joi.object({
    email: Joi.string().email().required().trim(),
    firstname: Joi.string().required().pattern(/^[A-Za-z\s]+$/).trim().messages({'string.pattern.base': 'firstname must contain only alphabetic characters'}),
    lastname: Joi.string().optional().allow(null, '').pattern(/^[A-Za-z\s]*$/).trim().messages({'string.pattern.base': 'lastname must contain only alphabetic characters'}),
    password: Joi.string().min(8).regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/).required().messages({'string.pattern.base': 'Password too weak'}),
    captchaToken: Joi.string().optional()
  })))
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Registration attempt for: ${registerDto.email}`);
    
    // TEST-04 Fix: Validate CAPTCHA if configured
    const captchaValid = await this.captchaService.verifyCaptcha(registerDto.captchaToken);
    if (captchaValid === false) {
      throw new BadRequestException('CAPTCHA validation failed. Please complete the CAPTCHA challenge.');
    }

    // Remove captchaToken before sending to auth service
    const { captchaToken, ...authPayload } = registerDto;
    
    return firstValueFrom(
      this.authClient.send({ cmd: 'register' }, authPayload).pipe(
        timeout(30000),
        catchError(error => {
          this.handleError(error, 'Registration');
          return throwError(() => error);
        }),
      )
    );
  }


  @Post('academy/select-role')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Select academy role' })
  async selectAcademyRole(@Request() req: any, @Body() selectRoleDto: SelectRoleDto) {
    // Inject userId from authenticated user
    const payload = { 
      ...selectRoleDto, 
      userId: req.user.firebaseId 
    };
    
    return firstValueFrom(
      this.authClient.send({ cmd: 'select_academy_role' }, payload).pipe(
        timeout(10000),
        catchError(error => {
          this.handleError(error, 'Select Academy Role');
          return throwError(() => error);
        }),
      )
    );
  }

  @Post('academy/apply-teacher')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Apply for teacher role' })
  async applyTeacher(@Request() req: any, @Body() applicationDto: TeacherApplicationDto) {
    const payload = {
      ...applicationDto,
      userId: req.user.firebaseId
    };

    return firstValueFrom(
      this.authClient.send({ cmd: 'apply_teacher_role' }, payload).pipe(
        timeout(10000),
        catchError(error => {
          this.handleError(error, 'Apply Teacher');
          return throwError(() => error);
        }),
      )
    );
  }

  @Get('academy/teacher-applications')
  @UseGuards(AuthGuard, AdminAccessGuard)
  @ApiOperation({ summary: 'Get all teacher applications (Admin only)' })
  async getTeacherApplications(@Request() req: any) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'get_teacher_applications' }, { requestingUserRole: req.user.globalRole }).pipe(
        timeout(10000),
        catchError(error => {
          this.handleError(error, 'Get Teacher Applications');
          return throwError(() => error);
        }),
      )
    );
  }

  @Post('academy/approve-teacher/:applicationId')
  @UseGuards(AuthGuard, AdminAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve teacher application (Admin only)' })
  async approveTeacher(@Request() req: any, @Param('applicationId') applicationId: string, @Body() body: { reviewNotes?: string }) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'approve_teacher_application' }, { 
        applicationId, 
        requestingUserRole: req.user.globalRole,
        reviewerId: req.user.firebaseId,
        reviewNotes: body.reviewNotes
      }).pipe(
        timeout(10000),
        catchError(error => {
          this.handleError(error, 'Approve Teacher');
          return throwError(() => error);
        }),
      )
    );
  }

  @Post('academy/reject-teacher/:applicationId')
  @UseGuards(AuthGuard, AdminAccessGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject teacher application (Admin only)' })
  async rejectTeacher(@Request() req: any, @Param('applicationId') applicationId: string, @Body() body: { reviewNotes?: string }) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'reject_teacher_application' }, { 
        applicationId, 
        requestingUserRole: req.user.globalRole,
        reviewerId: req.user.firebaseId,
        reviewNotes: body.reviewNotes
      }).pipe(
        timeout(10000),
        catchError(error => {
          this.handleError(error, 'Reject Teacher');
          return throwError(() => error);
        }),
      )
    );
  }

  @Post('academy/switch-role')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Switch user role' })
  async switchRole(@Request() req: any, @Body() switchRoleDto: SwitchRoleDto) {
    const payload = {
      ...switchRoleDto,
      userId: req.user.firebaseId
    };
    return firstValueFrom(
      this.authClient.send({ cmd: 'switch_role' }, payload).pipe(
        timeout(10000),
        catchError(error => {
          this.handleError(error, 'Switch Role');
          return throwError(() => error);
        }),
      )
    );
  }

  @Get('academy/user-status/:userId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get user academy status' })
  async getUserAcademyStatus(@Request() req: any, @Param('userId') userId: string) {
    // TEST-07 Fix: Verify user ownership - users can only view their own status unless they are admin
    // Note: Use req.user.id as the URL parameter is a numeric ID
    const requestingUserId = req.user.id.toString();
    const isAdmin = req.user.globalRole === 'ADMIN';
    
    if (requestingUserId !== userId && !isAdmin) {
      throw new ForbiddenException('You are not authorized to view another user\'s academy status');
    }
    
    return firstValueFrom(
      this.authClient.send({ cmd: 'get_user_academy_status' }, { userId }).pipe(
        timeout(10000),
        catchError(error => {
          this.handleError(error, 'Get User Academy Status');
          return throwError(() => error);
        }),
      )
    );
  }


  @Post('login/google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Google' })
  @UsePipes(new JoiValidationPipe(Joi.object({
    idToken: Joi.string().required()
  })))
  async loginWithGoogle(@Body() body: { idToken: string }) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'login_google' }, body).pipe(
        timeout(30000),
        catchError(error => {
          this.handleError(error, 'Google Login');
          return throwError(() => error);
        }),
      )
    );
  }

  @Post('session')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create session cookie from ID token' })
  async createSession(@Body() body: { idToken: string }, @Res({ passthrough: true }) response: Response) {
    const result = await firstValueFrom(
      this.authClient.send({ cmd: 'create_session' }, { idToken: body.idToken }).pipe(
        timeout(30000),
        catchError(error => {
          this.handleError(error, 'Create Session');
          return throwError(() => error);
        }),
      )
    );

    const { sessionCookie, expiresIn } = result;

    response.cookie('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { status: 'success', message: 'Session cookie set' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and clear session cookie' })
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('session');
    return { status: 'success', message: 'Logged out' };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify authentication token or cookie' })
  async verify(@Body() body: { type: 'cookie' | 'token'; value: string }) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'verify' }, body).pipe(
        timeout(10000),
        catchError(error => {
          this.handleError(error, 'Verify Auth');
          return throwError(() => error);
        }),
      )
    );
  }
}
