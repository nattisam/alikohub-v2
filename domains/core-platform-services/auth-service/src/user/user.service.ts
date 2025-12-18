import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(private readonly prisma: PrismaService) {}

	async findByFirebaseId(firebaseId: string) {
		this.logger.log(`Finding user by Firebase ID: ${firebaseId}`);
		const user = await this.prisma.user.findUnique({ where: { firebaseId } });
		this.logger.log(`User ${user ? 'found' : 'not found'} for Firebase ID: ${firebaseId}`);
		return user;
	}

	async findByEmail(email: string) {
		this.logger.log(`Finding user by email: ${email}`);
		const user = await this.prisma.user.findUnique({ where: { email } });
		this.logger.log(`User ${user ? 'found' : 'not found'} for email: ${email}`);
		return user;
	}

	async createUser(data: any) {
		this.logger.log(`Creating user with email: ${data.email}`);
		try {
			const user = await this.prisma.user.create({ data });
			this.logger.log(`Successfully created user with ID: ${user.id}`);
			return user;
		} catch (error) {
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
}
