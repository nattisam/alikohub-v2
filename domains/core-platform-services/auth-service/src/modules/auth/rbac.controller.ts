
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from './roles/roles.decorator';
import { RolesEnum } from './roles/roles.enum';
import { FirebaseAuthGuard } from './guard/firebase_auth.guard';
import { RolesGuard } from './roles/roles.guard';

@Controller('rbac')
export class RbacController {
	@Get('admin')
	@UseGuards(FirebaseAuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	getAdminResource() {
		return { message: 'Admin resource' };
	}

	@Get('user')
	@UseGuards(FirebaseAuthGuard, RolesGuard)
	@Roles(RolesEnum.USER)
	getUserResource() {
		return { message: 'User resource' };
	}

	@Get('academy-admin')
	@UseGuards(FirebaseAuthGuard, RolesGuard)
	@Roles('ACADEMY_ADMIN')
	getAcademyAdminResource() {
		return { message: 'Academy admin resource' };
	}

	@Get('consultancy-advisor')
	@UseGuards(FirebaseAuthGuard, RolesGuard)
	@Roles('CONSULTANCY_ADVISOR')
	getConsultancyAdvisorResource() {
		return { message: 'Consultancy advisor resource' };
	}
}
