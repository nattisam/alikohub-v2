import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthController } from '../auth.controller';

@Module({
  controllers: [UserController, AuthController]
})
export class UserModule {}
