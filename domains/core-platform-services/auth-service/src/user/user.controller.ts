import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@MessagePattern({ cmd: 'get_all_users' })
	async getAllUsers() {
		return this.userService.findAll();
	}

	@MessagePattern({ cmd: 'get_user_profile' })
	async getProfile(@Payload() data: { firebaseId: string }) {
		return this.userService.findByFirebaseId(data.firebaseId);
	}

	@MessagePattern({ cmd: 'update_user_profile' })
	async updateProfile(@Payload() data: { firebaseId: string; dto: any }) {
		return this.userService.updateProfile(data.firebaseId, data.dto);
	}

	@MessagePattern({ cmd: 'update_user_by_id' })
	async updateUserById(@Payload() data: { firebaseId: string; dto: any }) {
		return this.userService.updateProfile(data.firebaseId, data.dto);
	}

	@MessagePattern({ cmd: 'delete_user_profile' })
	async deleteProfile(@Payload() data: { firebaseId: string }) {
		return this.userService.deleteProfile(data.firebaseId);
	}

	@MessagePattern({ cmd: 'get_users_by_ids' })
	async getUsersByIds(@Payload() data: { userIds: string[] }) {
		const users = await Promise.all(
			data.userIds.map(id => this.userService.findByFirebaseId(id))
		);
		return users.filter(u => u !== null);
	}
}
