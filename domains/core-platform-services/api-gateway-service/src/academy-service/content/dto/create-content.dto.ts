import { IsEnum, IsInt, IsString, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType } from './upload-content.dto';

export class CreateContentDto {
  @ApiProperty({ example: 'Introduction Video' })
  @IsString()
  title!: string;

  @ApiProperty({ enum: ContentType })
  @IsEnum(ContentType)
  type!: ContentType;

  @ApiProperty({ example: 'https://example.com/video.mp4' })
  @IsUrl()
  url!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  lessonId!: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  order?: number;
}