import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ChecklistItemDto } from './check-list-item.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInspectionDto {
  @ApiProperty({
    description: 'ID of the project for the inspection',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  projectId!: number;

  @ApiProperty({
    description: 'ID of the inspector performing the inspection',
    example: 'inspector123',
  })
  @IsString()
  @IsNotEmpty()
  inspectorId!: string;

  @ApiPropertyOptional({
    description: 'Status of the inspection',
    example: 'PENDING',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    type: [ChecklistItemDto],
    description: 'Checklist items for the inspection',
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  checklist?: ChecklistItemDto[];
}
