import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChecklistItemDto {
  @ApiProperty({
    description: 'Description of the checklist item',
    maxLength: 255,
    example: 'Check foundation quality',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  itemDescription!: string;

  @ApiProperty({
    description: 'Status of the checklist item',
    example: 'PENDING',
  })
  @IsString()
  @IsNotEmpty()
  status!: string;

  @ApiPropertyOptional({
    description: 'Optional comment for the checklist item',
    maxLength: 500,
    example: 'Needs reinspection',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  comment?: string;
}
