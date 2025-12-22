import { Controller, Post, Get, Put, Body, Param, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { SelectRoleDto, TeacherApplicationDto, SwitchRoleDto } from './dto/academy-roles.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth/academy')
export class AcademyAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('select-role')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async selectRole(@Body() selectRoleDto: SelectRoleDto, @Request() req: any) {
    return this.authService.selectAcademyRole(selectRoleDto.userId, selectRoleDto.role);
  }

  @Post('apply-teacher')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async applyTeacher(@Body() applicationDto: TeacherApplicationDto, @Request() req: any) {
    return this.authService.applyForTeacherRole(applicationDto);
  }

  @Get('teacher-applications')
  @UseGuards(JwtAuthGuard)
  async getTeacherApplications(@Request() req: any) {
    return this.authService.getTeacherApplications();
  }

  @Post('approve-teacher/:applicationId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async approveTeacher(@Param('applicationId') applicationId: string, @Request() req: any) {
    return this.authService.approveTeacherApplication(applicationId);
  }

  @Post('reject-teacher/:applicationId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async rejectTeacher(@Param('applicationId') applicationId: string, @Request() req: any) {
    return this.authService.rejectTeacherApplication(applicationId);
  }

  @Post('switch-role')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async switchRole(@Body() switchRoleDto: SwitchRoleDto, @Request() req: any) {
    return this.authService.switchRole(req.user.id, switchRoleDto.newRole);
  }

  @Get('user-status')
  @UseGuards(JwtAuthGuard)
  async getUserStatus(@Request() req: any) {
    return this.authService.getUserAcademyStatus(req.user.id);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: any) {
    return this.authService.logout(req.user.id);
  }

  // Microservice message handlers
  @MessagePattern({ cmd: 'select_academy_role' })
  async handleSelectRole(@Payload() data: SelectRoleDto) {
    return this.authService.selectAcademyRole(data.userId, data.role);
  }

  @MessagePattern({ cmd: 'apply_teacher_role' })
  async handleTeacherApplication(@Payload() data: TeacherApplicationDto) {
    return this.authService.applyForTeacherRole(data);
  }

  @MessagePattern({ cmd: 'get_teacher_applications' })
  async handleGetTeacherApplications() {
    return this.authService.getTeacherApplications();
  }

  @MessagePattern({ cmd: 'approve_teacher_application' })
  async handleApproveTeacher(@Payload() data: { applicationId: string }) {
    return this.authService.approveTeacherApplication(data.applicationId);
  }

  @MessagePattern({ cmd: 'reject_teacher_application' })
  async handleRejectTeacher(@Payload() data: { applicationId: string }) {
    return this.authService.rejectTeacherApplication(data.applicationId);
  }

  @MessagePattern({ cmd: 'switch_role' })
  async handleSwitchRole(@Payload() data: { userId: string; newRole: 'student' | 'teacher' }) {
    return this.authService.switchRole(data.userId, data.newRole);
  }

  @MessagePattern({ cmd: 'get_user_academy_status' })
  async handleGetUserStatus(@Payload() data: { userId: string }) {
    return this.authService.getUserAcademyStatus(data.userId);
  }

  @MessagePattern({ cmd: 'academy_logout' })
  async handleLogout(@Payload() data: { userId: string }) {
    return this.authService.logout(data.userId);
  }
}
