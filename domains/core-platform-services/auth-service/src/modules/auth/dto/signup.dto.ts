import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { RolesEnum } from '../roles/roles.enum';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  firstname: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEnum(RolesEnum)
  @IsOptional()
  role?: RolesEnum = RolesEnum.USER;
}
