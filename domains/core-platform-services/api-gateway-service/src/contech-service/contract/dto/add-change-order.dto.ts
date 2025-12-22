import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddChangeOrderDto {
  @ApiProperty({
    description: 'Description of the change order',
    maxLength: 500,
    example: 'Added new feature X',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description!: string;

  @ApiProperty({
    description: 'Cost impact of the change order',
    example: 5000,
  })
  @IsNumber()
  @IsNotEmpty()
  costImpact!: number; // e.g., 5000 for +$5000, -200 for -$200

  @ApiProperty({
    description: 'Schedule impact of the change order',
    example: '+10 days',
  })
  @IsString()
  @IsNotEmpty()
  scheduleImpact!: string; // e.g., "+10 days", "No change"
}
