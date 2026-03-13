import { Module } from "@nestjs/common";
import { RegistrationsService } from "./registrations.service";
import { RegistrationsController } from "./registrations.controller";
import { DatabaseModule } from "../database/database.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [RegistrationsController],
  providers: [RegistrationsService],
  exports: [RegistrationsService],
})
export class RegistrationsModule {}
