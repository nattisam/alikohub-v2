import { IsEnum, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { ContentType } from './upload-content.dto';

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsInt()
  lessonId?: number;
}