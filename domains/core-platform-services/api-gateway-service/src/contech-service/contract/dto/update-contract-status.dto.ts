import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContractStatusDto {
  @ApiProperty({
    description: 'New status of the contract',
    example: 'APPROVED',
  })
  @IsString()
  @IsNotEmpty()
  status!: string;
}
