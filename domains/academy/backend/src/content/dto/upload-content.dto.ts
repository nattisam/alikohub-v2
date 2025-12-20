import { IsEnum, IsInt, IsString, IsOptional } from 'class-validator';
import { ContentType } from '@prisma/client';

export class UploadContentDto {
  @IsString()
  title: string;

  @IsEnum(ContentType)
  type: ContentType;

  @IsInt()
  lessonId: number;

  @IsOptional()
  @IsString()
  description?: string;
}