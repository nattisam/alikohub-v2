import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiPropertyOptional({
    description: 'User ID (optional, derived from token if omitted)',
    example: 'firebase_uid_123',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Cohort ID (optional)',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  cohortId?: number;

  @ApiProperty({
    description: 'Course ID',
    example: 10,
  })
  @IsInt()
  courseId!: number;
}
