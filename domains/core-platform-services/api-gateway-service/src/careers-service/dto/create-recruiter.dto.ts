import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateRecruiterDto {
  @ApiProperty({ description: 'Email for the new recruiter account' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstname!: string;

  @ApiPropertyOptional({ description: 'Last name' })
  @IsString()
  @IsOptional()
  lastname?: string;

  @ApiProperty({ description: 'Password for the new account', minLength: 8 })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({ description: 'Department of the recruiter' })
  @IsString()
  @IsOptional()
  department?: string;
}
