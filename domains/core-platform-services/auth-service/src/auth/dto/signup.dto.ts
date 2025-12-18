

import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class SignUpDto {
	@IsEmail()
	email: string;

	@IsNotEmpty()
	firstname: string;

	@IsOptional()
	lastname?: string;

	@IsOptional()
	@MinLength(6)
	password?: string;
}

