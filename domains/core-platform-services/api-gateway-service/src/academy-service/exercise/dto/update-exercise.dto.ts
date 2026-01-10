import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateExerciseDto } from './create-exercise.dto';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {}

export class SubmitExerciseDto {
  @ApiProperty({ description: 'Student answer (JSON)' })
  answer: any;
}

export class GradeExerciseDto {
  @ApiProperty({ description: 'Is the answer correct?' })
  isCorrect!: boolean;

  @ApiProperty({ description: 'Score assigned' })
  score!: number;

  @ApiPropertyOptional({ description: 'Feedback for the student' })
  feedback?: string;
}
