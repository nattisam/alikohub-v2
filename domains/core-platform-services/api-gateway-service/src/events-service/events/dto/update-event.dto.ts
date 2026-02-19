import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    date?: string;

    @IsString()
    @IsOptional()
    time?: string;

    @IsString()
    @IsOptional()
    location?: string;

    @ApiProperty({ type: 'string', format: 'binary', description: 'Event cover image' })
    @IsOptional()
    coverImage?: any;
}