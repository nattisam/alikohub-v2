import { Module } from "@nestjs/common";
import { RsvpsService } from "./rsvps.service";
import { RsvpsController } from "./rsvps.controller";
import { DatabaseModule } from "../database/database.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [RsvpsController],
  providers: [RsvpsService],
  exports: [RsvpsService],
})
export class RsvpsModule {}
