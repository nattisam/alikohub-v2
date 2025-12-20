import { Module } from '@nestjs/common';
import { TeachingScheduleController } from './teaching-schedule.controller';
import { ValidationPipe } from '@nestjs/common';

@Module({
    controllers: [TeachingScheduleController],
    providers: [
        {
            provide: 'APP_PIPE',
            useClass: ValidationPipe,
        },
    ],
})
export class TeachingScheduleModule { }