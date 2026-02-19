import { Controller, Post, Body, UsePipes, Logger, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { JoiValidationPipe } from '../validation.pipe';
import { RpcExceptionFilter } from '../common/filters/rpc-exception.filter';
import {
	GetUserProfileSchema,
	UpdateUserProfileSchema,
	GetUsersByIdsSchema,
	UpdateContechRoleSchema
} from './user.validation';

@Controller()
@UseFilters(RpcExceptionFilter)
export class UserController {
	private readonly logger = new Logger(UserController.name);
	constructor(private readonly userService: UserService) {}

	@Post('get-all-users')
	@MessagePattern({ cmd: 'get_all_users' })
	async getAllUsers() {
		this.logger.log(`Fetching all global users`);
		try {
			return await this.userService.findAll();
		} catch (error) {
			this.logger.error(`Failed to fetch all users: ${error.message}`, error.stack);
			throw error;
		}
	}

	@Post('get-user-profile')
	@MessagePattern({ cmd: 'get_user_profile' })
	@UsePipes(new JoiValidationPipe(GetUserProfileSchema))
	async getProfile(@Body() body: { firebaseId: string }, @Payload() payload: { firebaseId: string }) {
		const data = body || payload;
		this.logger.log(`Fetching profile for user: ${data.firebaseId}`);
		try {
			return await this.userService.findByFirebaseId(data.firebaseId);
		} catch (error) {
			this.logger.error(`Failed to fetch profile for user ${data.firebaseId}: ${error.message}`, error.stack);
			throw error;
		}
	}

	@Post('update-user-profile')
	@MessagePattern({ cmd: 'update_user_profile' })
	@UsePipes(new JoiValidationPipe(UpdateUserProfileSchema))
	async updateProfile(@Body() body: { firebaseId: string; dto: any }, @Payload() payload: { firebaseId: string; dto: any }) {
		const data = body || payload;
		this.logger.log(`Updating profile for user: ${data.firebaseId}`);
		try {
			return await this.userService.updateProfile(data.firebaseId, data.dto);
		} catch (error) {
			this.logger.error(`Failed to update profile for user ${data.firebaseId}: ${error.message}`, error.stack);
			throw error;
		}
	}

	@Post('update-user-by-id')
	@MessagePattern({ cmd: 'update_user_by_id' })
	@UsePipes(new JoiValidationPipe(UpdateUserProfileSchema))
	async updateUserById(@Body() body: { firebaseId: string; dto: any }, @Payload() payload: { firebaseId: string; dto: any }) {
		const data = body || payload;
		this.logger.log(`Updating user by ID (FirebaseId): ${data.firebaseId}`);
		try {
			return await this.userService.updateProfile(data.firebaseId, data.dto);
		} catch (error) {
			this.logger.error(`Failed to update user ID ${data.firebaseId}: ${error.message}`, error.stack);
			throw error;
		}
	}

	@Post('delete-user-profile')
	@MessagePattern({ cmd: 'delete_user_profile' })
	@UsePipes(new JoiValidationPipe(GetUserProfileSchema))
	async deleteProfile(@Body() body: { firebaseId: string }, @Payload() payload: { firebaseId: string }) {
		const data = body || payload;
		this.logger.log(`Deleting profile for user: ${data.firebaseId}`);
		try {
			return await this.userService.deleteProfile(data.firebaseId);
		} catch (error) {
			this.logger.error(`Failed to delete profile for user ${data.firebaseId}: ${error.message}`, error.stack);
			throw error;
		}
	}

	@Post('get-users-by-ids')
	@MessagePattern({ cmd: 'get_users_by_ids' })
	@UsePipes(new JoiValidationPipe(GetUsersByIdsSchema))
	async getUsersByIds(@Body() body: { userIds: string[] }, @Payload() payload: { userIds: string[] }) {
		const data = body || payload;
		this.logger.log(`Fetching multiple users. Count: ${data.userIds?.length || 0}`);
		try {
			const users = await Promise.all(
				data.userIds.map(id => this.userService.findByFirebaseId(id))
			);
			return users.filter(u => u !== null);
		} catch (error) {
			this.logger.error(`Failed to fetch users by batch: ${error.message}`, error.stack);
			throw error;
		}
	}

	@Post('update-contech-role')
	@MessagePattern({ cmd: 'update_contech_role' })
	@UsePipes(new JoiValidationPipe(UpdateContechRoleSchema))
	async updateContechRole(@Body() body: { userId: string; role: string }, @Payload() payload: { userId: string; role: string }) {
		const data = body || payload;
		this.logger.log(`Updating ConTech role to ${data.role} for user: ${data.userId}`);
		try {
			return await this.userService.updateContechRole(data.userId, data.role);
		} catch (error) {
			this.logger.error(`Failed to update ConTech role for user ${data.userId}: ${error.message}`, error.stack);
			throw error;
		}
	}
}
