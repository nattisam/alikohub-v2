import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyJobDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  coverLetter?: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Resume file (PDF, Doc)' })
  @IsOptional()
  resumeUrl?: any;
}
