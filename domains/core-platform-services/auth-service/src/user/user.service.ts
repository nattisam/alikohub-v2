import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(private readonly prisma: PrismaService) {}

	async findByFirebaseId(firebaseId: string) {
		this.logger.log(`Finding user by Firebase ID: ${firebaseId}`);
		const user = await this.prisma.user.findUnique({ 
			where: { firebaseId },
			include: {
				academyUser: true,
				consultancyUser: true,
				contechUser: true,
				eventsUser: true,
			}
		});
		this.logger.log(`User ${user ? 'found' : 'not found'} for Firebase ID: ${firebaseId}`);
		return user;
	}

	async findByEmail(email: string) {
		this.logger.log(`Finding user by email: ${email}`);
		const user = await this.prisma.user.findUnique({ 
			where: { email },
			include: {
				academyUser: true,
				consultancyUser: true,
				contechUser: true,
				eventsUser: true,
			}
		});
		this.logger.log(`User ${user ? 'found' : 'not found'} for email: ${email}`);
		return user;
	}

	async findById(userId: string | number) {
		const id = typeof userId === 'string' ? parseInt(userId) : userId;
		this.logger.log(`Finding user by ID: ${id}`);
		const user = await this.prisma.user.findUnique({ 
			where: { id },
			include: {
				academyUser: true,
				consultancyUser: true,
				contechUser: true,
				eventsUser: true,
			}
		});
		this.logger.log(`User ${user ? 'found' : 'not found'} for ID: ${id}`);
		return user;
	}

	async createUser(data: any) {
		this.logger.log(`Creating user with email: ${data.email}`);
		try {
			const user = await this.prisma.user.create({ data });
			this.logger.log(`Successfully created user with ID: ${user.id}`);
			return user;
		} catch (error: any) {
			this.logger.error(`Failed to create user with email: ${data.email}`, error);
			if (error.code === 'P2002') {
				// Unique constraint failed, return existing user
				this.logger.log(`User already exists, returning existing user for email: ${data.email}`);
				return this.prisma.user.findUnique({ where: { email: data.email } });
			}
			throw error;
		}
	}

	async createOrUpdateUser(data: any) {
		this.logger.log(`Upserting user with email: ${data.email}`);
		const user = await this.prisma.user.upsert({
			where: { email: data.email },
			update: data,
			create: data,
		});
		this.logger.log(`Successfully upserted user with ID: ${user.id}`);
		return user;
	}

	// Academy-specific methods
	async updateAcademyRole(firebaseId: string, role: string, status: string) {
		return this.prisma.academyUser.upsert({
			where: { userId: firebaseId },
			update: { role: role as any, status },
			create: { userId: firebaseId, role: role as any, status },
		});
	}

	async updateActiveAcademyRole(firebaseId: string, activeRole: string) {
		return this.prisma.academyUser.update({
			where: { userId: firebaseId },
			data: { role: activeRole as any },
		});
	}

	async createTeacherApplication(applicationData: any) {
		// Mock implementation as in modules
		return {
			id: 'mock-id-' + Date.now(),
			...applicationData,
			status: 'PENDING',
			submittedAt: new Date()
		};
	}

	async getTeacherApplications() {
		return [];
	}

	async getTeacherApplication(applicationId: string) {
		return null;
	}

	async updateTeacherApplicationStatus(applicationId: string, status: string) {
		return { id: applicationId, status };
	}

	async hasPendingTeacherApplication(userId: string) {
		return false;
	}

	// General User Methods
	async findAll() {
		this.logger.log('Finding all users');
		return this.prisma.user.findMany({
			include: {
				academyUser: true,
				consultancyUser: true,
				contechUser: true,
				eventsUser: true,
			}
		});
	}

	async updateProfile(firebaseId: string, data: any) {
		this.logger.log(`Updating profile for user: ${firebaseId}`);
		const user = await this.prisma.user.update({
			where: { firebaseId },
			data: {
				firstname: data.firstname,
				lastname: data.lastname,
				profilePicture: data.profilePicture,
				bio: data.bio,
			}
		});
		return user;
	}

	async deleteProfile(firebaseId: string) {
		this.logger.log(`Deleting profile for user: ${firebaseId}`);
		return this.prisma.user.delete({
			where: { firebaseId }
		});
	}
}
