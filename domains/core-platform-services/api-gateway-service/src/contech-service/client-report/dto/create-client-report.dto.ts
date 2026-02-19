import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { KpiDto } from './kpi.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientReportDto {
  @ApiProperty({
    description: 'Title of the client report',
    example: 'Q1 2025 Project Report',
  })
  @IsString()
  title!: string;

  @ApiProperty({ description: 'ID of the project', example: 123 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  projectId!: number;

  @ApiProperty({
    description: 'Summary of the report',
    example:
      'This report provides an overview of the project status, including key achievements and challenges.',
    minLength: 20,
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(5000)
  summary!: string;

  @ApiProperty({
    description: 'List of KPIs for the project',
    type: [KpiDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KpiDto)
  KPIs!: KpiDto[];
}
