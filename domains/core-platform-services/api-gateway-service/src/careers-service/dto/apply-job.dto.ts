import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyJobDto {
  @ApiProperty({ required: false, description: 'Optional: Full name if not set in profile' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ required: false, description: 'Optional: Email if not set in profile' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  coverLetter?: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Resume file (PDF, Doc)' })
  @IsOptional()
  resumeUrl?: any;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  experienceYears?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  currentTitle?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  currentCompany?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  skills?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  linkedInUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  portfolioUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  additionalInfo?: string;
}
