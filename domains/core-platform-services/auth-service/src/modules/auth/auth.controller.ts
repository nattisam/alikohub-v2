import { Controller, Post, Body, Res, HttpCode, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto/index';
import { Response } from 'express';
import * as Joi from 'joi';
import { JoiValidationPipe } from '../../validation.pipe';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}


	@Post('register')
	@UsePipes(new JoiValidationPipe(Joi.object({
		email: Joi.string().email().required(),
		firstname: Joi.string().required(),
		lastname: Joi.string().optional(),
		password: Joi.string().min(6).optional(),
		role: Joi.string().valid('USER', 'ADMIN', 'ACADEMY_ADMIN', 'ACADEMY_INSTRUCTOR', 'ACADEMY_STUDENT', 'CONSULTANCY_ADVISOR', 'CONSULTANCY_MANAGER', 'CONSULTANCY_CLIENT', 'CONTECH_DEVELOPER', 'CONTECH_DESIGNER', 'CONTECH_PROJECT_MANAGER', 'EVENTS_ORGANIZER', 'EVENTS_PARTICIPANT', 'EVENTS_SPONSOR').optional(),
	})))
	async register(@Body() dto: SignUpDto, @Res() res: Response) {
		const result = await this.authService.register(dto);
		return res.status(201).json(result);
	}

	@Post('login')
	@HttpCode(200)
	@UsePipes(new JoiValidationPipe(Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
	})))
	async login(@Body() dto: SignInDto, @Res() res: Response) {
		const result = await this.authService.login(dto);
		return res.json(result);
	}


	@Post('login/google')
	@HttpCode(200)
	@UsePipes(new JoiValidationPipe(Joi.object({
		idToken: Joi.string().required(),
	})))
	async loginWithGoogle(@Body() body: { idToken: string }, @Res() res: Response) {
		const result = await this.authService.loginWithGoogle(body.idToken);
		return res.json(result);
	}

	@Post('refresh')
	@HttpCode(200)
	@UsePipes(new JoiValidationPipe(Joi.object({
		refreshToken: Joi.string().required(),
	})))
	async refreshTokens(@Body() body: { refreshToken: string }, @Res() res: Response) {
		const result = await this.authService.refreshTokens(body.refreshToken);
		return res.json(result);
	}
}