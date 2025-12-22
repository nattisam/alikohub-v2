import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMilestoneDto {
  @ApiPropertyOptional({
    description: 'Title of the milestone',
    example: 'Foundation Completed',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Optional description of the milestone',
    example: 'Milestone description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Current status of the milestone',
    example: 'IN_PROGRESS',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
