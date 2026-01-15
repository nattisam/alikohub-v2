import { ScheduleType } from '@prisma/client';
import { IsString, IsOptional, IsDate, IsEnum, IsNumber, IsBoolean } from 'class-validator';

export class UpdateTeachingScheduleDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    startTime?: string;

    @IsOptional()
    @IsString()
    endTime?: string;

    @IsOptional()
    @IsEnum(ScheduleType)
    type?: ScheduleType;

    @IsOptional()
    @IsBoolean()
    isRecurring?: boolean;

    @IsOptional()
    @IsString()
    recurrencePattern?: string;
}