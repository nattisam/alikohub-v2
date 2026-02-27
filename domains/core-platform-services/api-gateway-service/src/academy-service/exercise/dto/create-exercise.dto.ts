import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ExerciseType } from '../exercise-type.enum';

export class CreateExerciseDto {
  @ApiProperty({ description: 'Module ID', example: 1 })
  @IsInt()
  moduleId!: number;

  @ApiPropertyOptional({ description: 'Lesson ID', example: 1 })
  @IsOptional()
  @IsInt()
  lessonId?: number;

  @ApiProperty({ description: 'Exercise title', example: 'Quiz 1' })
  @IsString()
  title!: string;

  @ApiProperty({ enum: ExerciseType, description: 'Type of exercise' })
  @IsEnum(ExerciseType)
  type!: ExerciseType;

  @ApiProperty({ description: 'Exercise question', example: 'What is 1+1?' })
  @IsString()
  question!: string;

  @ApiPropertyOptional({ description: 'Exercise description', example: 'Answer correctly' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'JSON options for the exercise' })
  @IsOptional()
  options?: any;

  @ApiPropertyOptional({ description: 'Correct answer (required for auto-graded)' })
  @IsOptional()
  correctAnswer?: any;

  @ApiPropertyOptional({ description: 'Hints', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hints?: string[];

  @ApiPropertyOptional({ description: 'Points', example: 1 })
  @IsOptional()
  @IsInt()
  points?: number;

  @ApiPropertyOptional({ description: 'Order in module', example: 0 })
  @IsOptional()
  @IsInt()
  order?: number;
}
