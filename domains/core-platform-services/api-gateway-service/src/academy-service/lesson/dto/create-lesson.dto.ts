import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateContentDto } from '../../content/dto/create-content.dto';

export class CreateLessonDto {
  @ApiProperty({
    description: 'Lesson title',
    example: 'Introduction to NestJS',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    description: 'Lesson type',
    example: 'VIDEO',
  })
  @IsString()
  type!: string;

  @ApiPropertyOptional({
    description: 'Due date (for assignments)',
    example: '2025-01-10T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Maximum score (for quizzes/assignments)',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  maxScore?: number;

  @ApiProperty({
    description: 'Module ID',
    example: 3,
  })
  @IsInt()
  moduleId!: number;

  @ApiPropertyOptional({
    description: 'Lesson contents (videos, PDFs, quizzes, etc.)',
    type: [CreateContentDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContentDto)
  contents?: CreateContentDto[];
}
