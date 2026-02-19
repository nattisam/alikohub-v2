import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: 'Advanced NestJS' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated short description' })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiPropertyOptional({ example: 'Updated long description' })
  @IsString()
  @IsOptional()
  longDescription?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Course thumbnail image' })
  @IsOptional()
  thumbnail?: any;

  @ApiPropertyOptional({ example: 'Backend' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    example: 'PUBLISHED',
  })
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  @IsOptional()
  status?: string;
}
