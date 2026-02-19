import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class KpiDto {
  @ApiProperty({
    description: 'Name of the KPI',
    example: 'Budget Variance',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'Current value of the KPI',
    example: '+5%',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  value!: string;

  @ApiProperty({
    description: 'Target for the KPI',
    example: '<2%',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  target!: string;
}
