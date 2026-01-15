import { Module } from '@nestjs/common';
import { UpdatesController } from './updates.controller';
import { PublicUpdatesController } from './public-updates.controller';

@Module({
    controllers: [UpdatesController, PublicUpdatesController]
})
export class UpdatesModule { }