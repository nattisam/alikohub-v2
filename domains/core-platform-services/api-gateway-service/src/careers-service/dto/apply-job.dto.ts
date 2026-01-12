import { IsString, IsOptional, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyJobDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  coverLetter?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  resumeUrl!: string;
}
