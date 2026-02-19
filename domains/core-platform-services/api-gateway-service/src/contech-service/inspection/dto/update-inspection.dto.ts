import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInspectionDto {
  @ApiProperty({ description: 'ID of the inspection to update' })
  @IsInt()
  id!: number;

  @ApiPropertyOptional({ description: 'Updated inspector ID' })
  @IsString()
  @IsOptional()
  inspector?: string;

  @ApiPropertyOptional({ description: 'Updated status of the inspection' })
  @IsString()
  @IsOptional()
  status?: string;
}
