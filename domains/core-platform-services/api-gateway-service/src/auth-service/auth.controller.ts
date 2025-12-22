import { Controller, Post, Get, Inject, Body, HttpCode, HttpStatus, Param, HttpException, Logger, Res, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthGuard } from '../common/guard/firebase_auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SelectRoleDto, TeacherApplicationDto, SwitchRoleDto } from './dto/academy-roles.dto';
import { catchError, timeout } from 'rxjs/operators';
import { throwError, TimeoutError, firstValueFrom } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

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
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt for: ${loginDto.email}`);
    
    return firstValueFrom(
      this.authClient.send({ cmd: 'login' }, loginDto).pipe(
        timeout(10000),
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
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Registration attempt for: ${registerDto.email}`);
    
    return firstValueFrom(
      this.authClient.send({ cmd: 'register' }, registerDto).pipe(
        timeout(10000),
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
      userId: req.user.id.toString() 
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
      userId: req.user.id.toString()
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
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all teacher applications' })
  async getTeacherApplications() {
    return firstValueFrom(
      this.authClient.send({ cmd: 'get_teacher_applications' }, {}).pipe(
        timeout(10000),
        catchError(error => {
          this.handleError(error, 'Get Teacher Applications');
          return throwError(() => error);
        }),
      )
    );
  }

  @Post('academy/approve-teacher/:applicationId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve teacher application' })
  async approveTeacher(@Param('applicationId') applicationId: string) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'approve_teacher_application' }, { applicationId }).pipe(
        timeout(10000),
        catchError(error => {
          this.handleError(error, 'Approve Teacher');
          return throwError(() => error);
        }),
      )
    );
  }

  @Post('academy/reject-teacher/:applicationId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject teacher application' })
  async rejectTeacher(@Param('applicationId') applicationId: string) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'reject_teacher_application' }, { applicationId }).pipe(
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
      userId: req.user.id.toString()
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
  async getUserAcademyStatus(@Param('userId') userId: string) {
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
  async loginWithGoogle(@Body() body: { idToken: string }) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'login_google' }, body).pipe(
        timeout(10000),
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
        timeout(10000),
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
