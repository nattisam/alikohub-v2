import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { CreateExerciseDto } from './create-exercise.dto';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {}

export class SubmitExerciseDto {
  @ApiProperty({ description: 'Student answer (JSON)' })
  @IsNotEmpty()
  answer: any;
}

export class GradeExerciseDto {
  @ApiProperty({ description: 'Is the answer correct?' })
  @IsBoolean()
  isCorrect!: boolean;

  @ApiProperty({ description: 'Score assigned' })
  @IsNumber()
  score!: number;

  @ApiPropertyOptional({ description: 'Feedback for the student' })
  @IsOptional()
  @IsString()
  feedback?: string;
}
