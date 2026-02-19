import { IsDateString, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCohortDto {
  @ApiProperty({ example: 'January 2025 Cohort' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 1, description: 'Course ID' })
  @IsInt()
  courseId!: number;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Cohort start date',
  })
  @IsDateString()
  startDate!: string;

  @ApiProperty({
    example: '2025-03-01T00:00:00.000Z',
    description: 'Cohort end date',
  })
  @IsDateString()
  endDate!: string;
}
