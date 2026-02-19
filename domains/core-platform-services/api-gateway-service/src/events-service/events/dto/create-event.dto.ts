import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ enum: ['EVENT', 'ANNOUNCEMENT', 'NEWS'] })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Cover image' })
  @IsOptional()
  coverImage?: any;

  // Event specific fields
  @IsString()
  @IsOptional()
  eventDate?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  externalLink?: string;
}