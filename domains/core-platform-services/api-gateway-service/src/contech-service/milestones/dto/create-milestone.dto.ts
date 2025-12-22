import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMilestoneDto {
  @ApiProperty({
    description: 'ID of the project this milestone belongs to',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  projectId!: number;

  @ApiProperty({
    description: 'Title of the milestone',
    example: 'Foundation Completed',
  })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiPropertyOptional({
    description: 'Optional description of the milestone',
    example: 'Milestone description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Current status of the milestone',
    example: 'PLANNED',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Due date for the milestone',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDate()
  dueDate?: Date;
}
