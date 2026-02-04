import { Controller, Post, Body } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('get-all-users')
  @MessagePattern({ cmd: 'get_all_users' })
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Post('get-user-profile')
  @MessagePattern({ cmd: 'get_user_profile' })
  async getProfile(
    @Body() body: { firebaseId: string },
    @Payload() payload: { firebaseId: string },
  ) {
    const data = body || payload;
    return this.userService.findByFirebaseId(data.firebaseId);
  }

  @Post('update-user-profile')
  @MessagePattern({ cmd: 'update_user_profile' })
  async updateProfile(
    @Body() body: { firebaseId: string; dto: any },
    @Payload() payload: { firebaseId: string; dto: any },
  ) {
    const data = body || payload;
    return this.userService.updateProfile(data.firebaseId, data.dto);
  }

  @Post('update-user-by-id')
  @MessagePattern({ cmd: 'update_user_by_id' })
  async updateUserById(
    @Body() body: { firebaseId: string; dto: any },
    @Payload() payload: { firebaseId: string; dto: any },
  ) {
    const data = body || payload;
    return this.userService.updateProfile(data.firebaseId, data.dto);
  }

  @Post('delete-user-profile')
  @MessagePattern({ cmd: 'delete_user_profile' })
  async deleteProfile(
    @Body() body: { firebaseId: string },
    @Payload() payload: { firebaseId: string },
  ) {
    const data = body || payload;
    return this.userService.deleteProfile(data.firebaseId);
  }

  @Post('get-users-by-ids')
  @MessagePattern({ cmd: 'get_users_by_ids' })
  async getUsersByIds(
    @Body() body: { userIds: string[] },
    @Payload() payload: { userIds: string[] },
  ) {
    const data = body || payload;
    const users = await Promise.all(
      data.userIds.map((id) => this.userService.findByFirebaseId(id)),
    );
    return users.filter((u) => u !== null);
  }

  @Post('update-contech-role')
  @MessagePattern({ cmd: 'update_contech_role' })
  async updateContechRole(
    @Body() body: { userId: string; role: string },
    @Payload() payload: { userId: string; role: string },
  ) {
    const data = body || payload;
    return this.userService.updateContechRole(data.userId, data.role);
  }
}
