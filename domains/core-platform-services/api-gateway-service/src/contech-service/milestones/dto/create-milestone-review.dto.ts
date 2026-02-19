import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMilestoneReviewDto {
  @ApiProperty({
    description: 'ID of the inspector submitting the review',
    example: 'inspector123',
  })
  @IsNotEmpty()
  @IsString()
  inspectorId!: string;

  @ApiProperty({
    description: 'Status of the milestone review',
    example: 'APPROVED',
  })
  @IsNotEmpty()
  @IsString()
  status!: string;

  @ApiProperty({
    description: 'Comments from the inspector',
    example: 'Everything looks good.',
  })
  @IsNotEmpty()
  @IsString()
  comments!: string;
}
