import { Module } from "@nestjs/common";
import { InspectionController } from "./inspection.controller";
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
    imports: [
    MulterModule.register({
      storage: memoryStorage(), 
    }),
  ],
    controllers: [InspectionController]
})
export class InspectionModule {}