import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GradeExerciseDto {
  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  score: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}
