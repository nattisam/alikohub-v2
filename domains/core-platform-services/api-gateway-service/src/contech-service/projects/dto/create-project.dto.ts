import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Name of the project',
    example: 'New Office Building',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    description: 'Description of the project',
    example: 'Construction of 10-story office building',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Client ID associated with the project',
    example: 'client_12345',
  })
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiProperty({
    description: 'Start date of the project',
    example: '2025-01-01',
  })
  @IsDateString()
  startDate!: string;

  @ApiPropertyOptional({
    description: 'End date of the project',
    example: '2025-12-31',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Budget of the project',
    example: 1000000,
  })
  @IsNumber()
  @IsOptional()
  budget?: number;

  @ApiPropertyOptional({
    description: 'Project location',
    example: 'Addis Ababa',
  })
  @IsString()
  @IsOptional()
  location?: string;
}
