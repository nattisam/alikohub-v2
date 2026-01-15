import { Module } from '@nestjs/common';
import { UpdatesService } from './updates.service';
import { UpdatesController } from './updates.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [UpdatesController],
    providers: [UpdatesService],
    exports: [UpdatesService],
})
export class UpdatesModule { }