import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsOptional()
  time?: string;

  @IsString()
  @IsNotEmpty()
  location!: string;
}