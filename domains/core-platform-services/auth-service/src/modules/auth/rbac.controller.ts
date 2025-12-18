
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
	@Roles(RolesEnum.ACADEMY_ADMIN)
	getAcademyAdminResource() {
		return { message: 'Academy admin resource' };
	}

	@Get('academy-instructor')
	@UseGuards(FirebaseAuthGuard, RolesGuard)
	@Roles(RolesEnum.ACADEMY_INSTRUCTOR)
	getAcademyInstructorResource() {
		return { message: 'Academy instructor resource' };
	}

	@Get('academy-student')
	@UseGuards(FirebaseAuthGuard, RolesGuard)
	@Roles(RolesEnum.ACADEMY_STUDENT)
	getAcademyStudentResource() {
		return { message: 'Academy student resource' };
	}

	@Get('consultancy-advisor')
	@UseGuards(FirebaseAuthGuard, RolesGuard)
	@Roles(RolesEnum.CONSULTANCY_ADVISOR)
	getConsultancyAdvisorResource() {
		return { message: 'Consultancy advisor resource' };
	}

	@Get('consultancy-manager')
	@UseGuards(FirebaseAuthGuard, RolesGuard)
	@Roles(RolesEnum.CONSULTANCY_MANAGER)
	getConsultancyManagerResource() {
		return { message: 'Consultancy manager resource' };
	}

	@Get('consultancy-client')
	@UseGuards(FirebaseAuthGuard, RolesGuard)
	@Roles(RolesEnum.CONSULTANCY_CLIENT)
	getConsultancyClientResource() {
		return { message: 'Consultancy client resource' };
	}

	@Get('contech-developer')
	@UseGuards(FirebaseAuthGuard, RolesGuard)
	@Roles(RolesEnum.CONTECH_DEVELOPER)
	getContechDeveloperResource() {
		return { message: 'Contech developer resource' };
	}

	@Get('contech-designer')
	@UseGuards(FirebaseAuthGuard, RolesGuard)
	@Roles(RolesEnum.CONTECH_DESIGNER)
	getContechDesignerResource() {
		return { message: 'Contech designer resource' };
	}

	@Get('contech-project-manager')
	@UseGuards(FirebaseAuthGuard, RolesGuard)
	@Roles(RolesEnum.CONTECH_PROJECT_MANAGER)
	getContechProjectManagerResource() {
		return { message: 'Contech project manager resource' };
	}

	@Get('events-organizer')
	@UseGuards(FirebaseAuthGuard, RolesGuard)
	@Roles(RolesEnum.EVENTS_ORGANIZER)
	getEventsOrganizerResource() {
		return { message: 'Events organizer resource' };
	}

	@Get('events-participant')
	@UseGuards(FirebaseAuthGuard, RolesGuard)
	@Roles(RolesEnum.EVENTS_PARTICIPANT)
	getEventsParticipantResource() {
		return { message: 'Events participant resource' };
	}

	@Get('events-sponsor')
	@UseGuards(FirebaseAuthGuard, RolesGuard)
	@Roles(RolesEnum.EVENTS_SPONSOR)
	getEventsSponsorResource() {
		return { message: 'Events sponsor resource' };
	}
}
