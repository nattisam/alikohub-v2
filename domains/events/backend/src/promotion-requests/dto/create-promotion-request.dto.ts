import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreatePromotionRequestDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
