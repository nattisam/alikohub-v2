import { Module } from "@nestjs/common";
import { MessagingService } from "./messaging.service";
import { MessagingController } from "./messaging.controller";
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "../auth";

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [MessagingController],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
