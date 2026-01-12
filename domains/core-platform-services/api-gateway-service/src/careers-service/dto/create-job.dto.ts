import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  FREELANCE = 'FREELANCE',
}

export enum JobStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export class CreateJobDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requirements!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  salaryRange?: string;

  @ApiProperty({ required: false, default: 'Remote' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ enum: JobType, default: JobType.FULL_TIME })
  @IsEnum(JobType)
  @IsOptional()
  type?: JobType;

  @ApiProperty({ enum: JobStatus, default: JobStatus.OPEN })
  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;
}
