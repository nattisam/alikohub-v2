import { IsString, IsOptional } from 'class-validator';

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
}