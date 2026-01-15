import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TrackProgressDto {
  @ApiProperty({ description: 'User ID', example: 'uid_123' })
  @IsString()
  userId!: string;

  @ApiProperty({ description: 'Course ID', example: 101 })
  @IsInt()
  courseId!: number;

  @ApiProperty({ description: 'Status of the progress', example: 'COMPLETED' })
  @IsString()
  status!: string;

  @ApiPropertyOptional({ description: 'Score obtained', example: 85 })
  @IsOptional()
  @IsInt()
  score?: number;

  @ApiPropertyOptional({ description: 'Module ID', example: 12 })
  @IsOptional()
  @IsInt()
  moduleId?: number;

  @ApiPropertyOptional({ description: 'Quiz ID', example: 5 })
  @IsOptional()
  @IsInt()
  quizId?: number;

  @ApiPropertyOptional({ description: 'Assignment ID', example: 7 })
  @IsOptional()
  @IsInt()
  assignmentId?: number;
}
