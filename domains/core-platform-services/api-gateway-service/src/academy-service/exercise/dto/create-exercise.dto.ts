import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExerciseType } from '../exercise-type.enum';

export class CreateExerciseDto {
  @ApiProperty({ description: 'Module ID', example: 1 })
  moduleId!: number;

  @ApiProperty({ description: 'Exercise title', example: 'Quiz 1' })
  title!: string;

  @ApiProperty({ enum: ExerciseType, description: 'Type of exercise' })
  type!: ExerciseType;

  @ApiProperty({ description: 'Exercise question', example: 'What is 1+1?' })
  question!: string;

  @ApiPropertyOptional({ description: 'Exercise description', example: 'Answer correctly' })
  description?: string;

  @ApiPropertyOptional({ description: 'JSON options for the exercise' })
  options?: any;

  @ApiPropertyOptional({ description: 'Correct answer (required for auto-graded)' })
  correctAnswer?: any;

  @ApiPropertyOptional({ description: 'Hints', type: [String] })
  hints?: string[];

  @ApiPropertyOptional({ description: 'Points', example: 1 })
  points?: number;

  @ApiPropertyOptional({ description: 'Order in module', example: 0 })
  order?: number;
}
