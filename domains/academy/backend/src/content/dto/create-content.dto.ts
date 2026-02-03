import { IsEnum, IsInt, IsString, IsUrl, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ContentType } from '@prisma/client';

export class CreateContentDto {
  @IsString()
  title: string;

  @IsEnum(ContentType)
  type: ContentType;

  @IsUrl()
  url: string;

  @IsInt()
  lessonId: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  fileSize?: number; // in bytes

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsNumber()
  duration?: number; // for videos, in seconds

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean; // whether content is publicly accessible

  @IsOptional()
  @IsString()
  metadata?: string; // JSON string for additional metadata

  @IsOptional()
  @IsInt()
  order?: number;
}