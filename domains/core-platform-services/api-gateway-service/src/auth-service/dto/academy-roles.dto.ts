import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, ValidateNested, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SelectRoleDto {
  @ApiPropertyOptional({ description: 'User ID (automatically injected if authenticated)' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ enum: ['student', 'teacher', 'instructor'], example: 'student' })
  @IsEnum(['student', 'teacher', 'instructor'])
  @IsNotEmpty()
  role!: 'student' | 'teacher' | 'instructor';
}

export class TeacherApplicationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty()
  @IsNotEmpty()
  personalDetails!: {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
  };

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  teachingCategories!: string[];

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Teacher resume file' })
  @IsOptional()
  resumeUrl?: any;

  @ApiProperty()
  @IsArray()
  interviewResponses!: {
    question: string;
    answer: string;
  }[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  documents?: {
    name: string;
    url: string;
  }[];
}

export class InstructorApplicationDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstname!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastname!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiPropertyOptional({ example: '+123456789' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Web Development, AI', description: 'Comma-separated categories' })
  @IsString()
  @IsNotEmpty()
  teachingCategories!: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Teacher resume file (PDF/DOCX)' })
  @IsOptional()
  resume?: any;

  @ApiPropertyOptional({ example: '[{"question":"Why?","answer":"Because"}]', description: 'JSON string of interview responses' })
  @IsString()
  @IsOptional()
  interviewResponses?: string;
}

export class SwitchRoleDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ enum: ['student', 'teacher', 'instructor'], example: 'teacher' })
  @IsEnum(['student', 'teacher', 'instructor'])
  @IsNotEmpty()
  newRole!: 'student' | 'teacher' | 'instructor';
}
