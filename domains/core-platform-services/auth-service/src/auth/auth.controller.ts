import { Controller, UsePipes, Logger } from '@nestjs/common';
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

	@MessagePattern({ cmd: 'register' })
	@UsePipes(new JoiValidationPipe(Joi.object({
		email: Joi.string().email().required().trim(),
		firstname: Joi.string().required().pattern(/^[A-Za-z\s]+$/).trim().messages({'string.pattern.base': 'firstname must contain only alphabetic characters'}),
		lastname: Joi.string().optional().allow(null, '').pattern(/^[A-Za-z\s]*$/).trim().messages({'string.pattern.base': 'lastname must contain only alphabetic characters'}),
		password: Joi.string().min(8).regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/).required(),
	})))
	async register(@Payload() dto: SignUpDto) {
		return this.authService.register(dto);
	}

	@MessagePattern({ cmd: 'create_recruiter' })
	@UsePipes(new JoiValidationPipe(Joi.object({
		email: Joi.string().email().required().trim(),
		firstname: Joi.string().required().pattern(/^[A-Za-z\s]+$/).trim().messages({'string.pattern.base': 'firstname must contain only alphabetic characters'}),
		lastname: Joi.string().optional().allow(null, '').pattern(/^[A-Za-z\s]*$/).trim().messages({'string.pattern.base': 'lastname must contain only alphabetic characters'}),
		password: Joi.string().min(8).regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/).required(),
	})))
	async createRecruiter(@Payload() dto: any) {
		return this.authService.createRecruiter(dto);
	}

	@MessagePattern({ cmd: 'create_contech_user' })
	@UsePipes(new JoiValidationPipe(Joi.object({
		email: Joi.string().email().required().trim(),
		firstname: Joi.string().required().pattern(/^[A-Za-z\s]+$/).trim().messages({'string.pattern.base': 'firstname must contain only alphabetic characters'}),
		lastname: Joi.string().optional().allow(null, '').pattern(/^[A-Za-z\s]*$/).trim().messages({'string.pattern.base': 'lastname must contain only alphabetic characters'}),
		password: Joi.string().min(8).regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/).required(),
		role: Joi.string().valid('ADMIN', 'CONTRACTOR', 'CLIENT').required(),
	})))
	async createContechUser(@Payload() dto: any) {
		return this.authService.createContechUser(dto);
	}

	@MessagePattern({ cmd: 'create_events_user' })
	@UsePipes(new JoiValidationPipe(Joi.object({
		email: Joi.string().email().required().trim(),
		firstname: Joi.string().required().pattern(/^[A-Za-z\s]+$/).trim().messages({'string.pattern.base': 'firstname must contain only alphabetic characters'}),
		lastname: Joi.string().optional().allow(null, '').pattern(/^[A-Za-z\s]*$/).trim().messages({'string.pattern.base': 'lastname must contain only alphabetic characters'}),
		password: Joi.string().min(8).regex(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/).required(),
		role: Joi.string().valid('ADMIN', 'CONTENT_MANAGER', 'USER').required(),
	})))
	async createEventsUser(@Payload() dto: any) {
		return this.authService.createEventsUser(dto);
	}

	@MessagePattern({ cmd: 'login' })
	@UsePipes(new JoiValidationPipe(Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
	})))
	async login(@Payload() dto: SignInDto) {
		return this.authService.login(dto);
	}


	@MessagePattern({ cmd: 'login_google' })
	@UsePipes(new JoiValidationPipe(Joi.object({
		idToken: Joi.string().required(),
	})))
	async loginWithGoogle(@Payload() body: { idToken: string }) {
		return this.authService.loginWithGoogle(body.idToken);
	}

	@MessagePattern({ cmd: 'verify' })
	async verify(@Payload() payload: { type: 'cookie' | 'token'; value: string }) {
		return this.authService.verifyAuth(payload);
	}

	@MessagePattern({ cmd: 'create_session' })
	async createSession(@Payload() data: { idToken: string; expiresIn?: number }) {
		return this.authService.createSessionCookie(data.idToken, data.expiresIn);
	}

	// Academy-specific message patterns
	@MessagePattern({ cmd: 'select_academy_role' })
	@UsePipes(new JoiValidationPipe(Joi.object({
		userId: Joi.string().required(),
		role: Joi.string().valid('student', 'teacher', 'instructor').required().lowercase()
	})))
	async handleSelectRole(@Payload() data: SelectRoleDto) {
		try {
			return await this.authService.selectAcademyRole(data.userId, data.role);
		} catch (error) {
			this.logger.error(`Error in select_academy_role: ${error.message}`, error.stack);
			throw error;
		}
	}

	@MessagePattern({ cmd: 'apply_teacher_role' })
	async handleTeacherApplication(@Payload() data: TeacherApplicationDto) {
		try {
			return await this.authService.applyForTeacherRole(data);
		} catch (error) {
			this.logger.error(`Error in apply_teacher_role: ${error.message}`, error.stack);
			throw error;
		}
	}

	@MessagePattern({ cmd: 'get_teacher_applications' })
	async handleGetTeacherApplications(@Payload() data: { requestingUserRole?: string }) {
		return this.authService.getTeacherApplications(data.requestingUserRole);
	}

	@MessagePattern({ cmd: 'approve_teacher_application' })
	async handleApproveTeacher(@Payload() data: { applicationId: string; requestingUserRole?: string; reviewerId?: string; reviewNotes?: string }) {
		return this.authService.approveTeacherApplication(data.applicationId, data.requestingUserRole, data.reviewerId, data.reviewNotes);
	}

	@MessagePattern({ cmd: 'reject_teacher_application' })
	async handleRejectTeacher(@Payload() data: { applicationId: string; requestingUserRole?: string; reviewerId?: string; reviewNotes?: string }) {
		return this.authService.rejectTeacherApplication(data.applicationId, data.requestingUserRole, data.reviewerId, data.reviewNotes);
	}

	@MessagePattern({ cmd: 'switch_role' })
	@UsePipes(new JoiValidationPipe(Joi.object({
		userId: Joi.string().required(),
		newRole: Joi.string().valid('student', 'teacher', 'instructor').required().lowercase()
	})))
	async handleSwitchRole(@Payload() data: { userId: string; newRole: string }) {
		try {
			return await this.authService.switchRole(data.userId, data.newRole);
		} catch (error) {
			this.logger.error(`Error in switch_role: ${error.message}`, error.stack);
			throw error;
		}
	}

	@MessagePattern({ cmd: 'get_user_academy_status' })
	async handleGetUserStatus(@Payload() data: { userId: string }) {
		return this.authService.getUserAcademyStatus(data.userId);
	}

	@MessagePattern({ cmd: 'sync_contech_user' })
	async handleSyncContechUser(@Payload() data: { userId: string }) {
		return this.authService.syncContechUser(data.userId);
	}

	@MessagePattern({ cmd: 'sync_events_user' })
	async handleSyncEventsUser(@Payload() data: { userId: string }) {
		return this.authService.syncEventsUser(data.userId);
	}

	@MessagePattern({ cmd: 'sync_academy_user' })
	async handleSyncAcademyUser(@Payload() data: { userId: string }) {
		return this.authService.syncAcademyUser(data.userId);
	}
	@MessagePattern({ cmd: 'send_contact_email' })
	async handleSendContactEmail(@Payload() dto: any) {
		return this.authService.sendContactEmail(dto);
	}

	@MessagePattern({ cmd: 'update_status' })
	async handleUpdateStatus(@Payload() data: { firebaseId: string; status: string }) {
		return this.authService.updateStatus(data.firebaseId, data.status);
	}

	@MessagePattern({ cmd: 'delete_user' })
	async handleDeleteUser(@Payload() data: { firebaseId: string }) {
		return this.authService.deleteUser(data.firebaseId);
	}
}
