import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Intro to NestJS' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'Learn NestJS basics' })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiPropertyOptional({ example: 'Full NestJS course' })
  @IsString()
  @IsOptional()
  longDescription?: string;

  @ApiPropertyOptional({ example: 'https://img.png' })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiPropertyOptional({ example: 'Backend' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    example: 'DRAFT',
  })
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status!: string;

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @IsOptional()
  enrolledNum?: number;
}
