import { IsEnum, IsInt, IsString, IsUrl } from 'class-validator';
import { ContentType } from './upload-content.dto';

export class CreateContentDto {
  @IsString()
  title!: string;

  @IsEnum(ContentType)
  type!: ContentType;

  @IsUrl()
  url!: string;

  @IsInt()
  lessonId!: number;
}