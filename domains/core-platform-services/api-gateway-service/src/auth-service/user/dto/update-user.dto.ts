import { IsString, IsOptional, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'User avatar image' })
  @IsOptional()
  avatar?: any;

  @IsOptional()
  @IsString()
  bio?: string;
}
