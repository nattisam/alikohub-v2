import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UserSyncController } from './user-sync.controller';

@Module({
  controllers: [ProfileController, UserSyncController],
  providers: [ProfileService],
})
export class ProfileModule {}
