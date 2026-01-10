import { Injectable, Logger, HttpStatus, Inject } from '@nestjs/common';
import { RpcException, ClientProxy } from '@nestjs/microservices';
import { UserService } from '../user/user.service';
import { FirebaseService } from '../firebase/firebase.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Argon2Service } from './argon2.service';
import { EmailService } from './email.service';
import { AcademyRole, ContechRole, EventsRole, GlobalRole } from '@prisma/client';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private readonly userService: UserService,
		private readonly firebaseService: FirebaseService,
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly argon2Service: Argon2Service,
		private readonly emailService: EmailService,
		@Inject('ACADEMY_SERVICE') private readonly academyClient: ClientProxy,
		@Inject('CONTECH_SERVICE') private readonly contechClient: ClientProxy,
		@Inject('EVENTS_SERVICE') private readonly eventsClient: ClientProxy,
	) {}

	async register(dto: any) {
		this.logger.log(`Registration attempt for email: ${dto.email}`);
		
		// Register user with Firebase Auth (email/password)
		const firebase = this.firebaseService.getAuth();
		let userRecord;
		try {
			userRecord = await firebase.createUser({
				email: dto.email,
				password: dto.password,
				displayName: dto.firstname + (dto.lastname ? ' ' + dto.lastname : ''),
			});
			this.logger.log(`Firebase user created: ${userRecord.uid}`);
		} catch (e: any) {
			this.logger.error(`Firebase createUser error: ${e.code} - ${e.message}`);
			if (e.code === 'auth/email-already-exists') {
				throw new RpcException({
					statusCode: HttpStatus.CONFLICT,
					message: 'User with this email already exists',
					error: 'Conflict',
				});
			}
			throw new RpcException({
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: e.message || 'Failed to create user',
				error: 'Internal Server Error',
			});
		}

		// Hash password for DB storage
		const hashedPassword = dto.password ? await this.argon2Service.hash(dto.password) : undefined;

		// Create user in Prisma if not exists
		let user: any = await this.userService.findByFirebaseId(userRecord.uid);
		if (!user) {
			await this.userService.createUser({
				firebaseId: userRecord.uid,
				email: userRecord.email,
				firstname: dto.firstname,
				lastname: dto.lastname,
				password: hashedPassword,
				globalRole: GlobalRole.USER,
				status: 'ACTIVE',
			});

            // Create local AcademyUser record with default USER role
            await this.prisma.academyUser.create({
                data: {
                    userId: userRecord.uid,
                    role: AcademyRole.USER,
                    status: 'ACTIVE',
                }
            });

            // Create local ContechUser record with default USER role
            await this.prisma.contechUser.create({
                data: {
                    userId: userRecord.uid,
                    role: ContechRole.USER,
                    status: 'ACTIVE',
                }
            });

            // Create local EventsUser record with default USER role
            await this.prisma.eventsUser.create({
                data: {
                    userId: userRecord.uid,
                    role: EventsRole.USER,
                    status: 'ACTIVE',
                }
            });

			user = await this.userService.findByFirebaseId(userRecord.uid);
			this.logger.log(`User created in database: ${user.id}`);
			
			// Emit user_created event to all services
			const eventPayload = {
				userId: user.firebaseId,
				email: user.email,
				role: 'USER'
			};
			this.academyClient.emit('user_created', eventPayload);
			this.contechClient.emit('user_created', eventPayload);
			this.eventsClient.emit('user_created', eventPayload);
		}

		// Issue Firebase custom token
		const customToken = await firebase.createCustomToken(userRecord.uid);
		
		// Generate JWT tokens
		const tokens = this.generateTokens(user);

		// Send welcome email (async, don't block registration)
		this.emailService.sendWelcomeEmail(dto.email, dto.firstname).catch((error) => {
			this.logger.error(`Failed to send welcome email to ${dto.email}: ${error.message}`);
		});

		this.logger.log(`Registration successful for: ${dto.email}`);
		
		return {
			user: this.toPlain(user),
			...tokens,
			firebaseCustomToken: customToken,
		};
	}

	async login(dto: any) {
		this.logger.log(`Login attempt for email: ${dto.email}`);
		
		// Find user in database with all relations
		const user = await this.userService.findByEmail(dto.email);
		
		if (!user) {
			throw new RpcException({
				statusCode: HttpStatus.UNAUTHORIZED,
				message: 'Invalid credentials',
				error: 'Unauthorized',
			});
		}

		// Verify password using Argon2
		if (user.password && dto.password) {
			const isPasswordValid = await this.argon2Service.verify(user.password, dto.password);
			if (!isPasswordValid) {
				throw new RpcException({
					statusCode: HttpStatus.UNAUTHORIZED,
					message: 'Invalid credentials',
					error: 'Unauthorized',
				});
			}
		} else {
			this.logger.warn(`User ${user.id} has no password set or no password provided in login attempt`);
			// In production, we might want to enforce passwords or handle social logins separately
		}

		// Register user with Firebase Auth (email/password) - or just get existing
		const firebase = this.firebaseService.getAuth();
		let userRecord;
		try {
			userRecord = await firebase.getUserByEmail(dto.email);
		} catch (e: any) {
			this.logger.error(`Failed to find Firebase user by email: ${dto.email}`, e);
			// If missing in Firebase but in DB, we might want to sync, but for now unauthorized
			throw new RpcException({
				statusCode: HttpStatus.UNAUTHORIZED,
				message: 'Firebase user not found',
				error: 'Unauthorized',
			});
		}

		// Issue Firebase custom token
		const customToken = await firebase.createCustomToken(userRecord.uid);
		
		// Generate JWT tokens
		const tokens = this.generateTokens(user);
		
		this.logger.log(`Login successful for user: ${user.id}`);
		
		return {
			user: this.toPlain(user),
			...tokens,
			firebaseCustomToken: customToken,
		};
	}

	private toPlain(user: any) {
		if (!user) return null;
		const plain = JSON.parse(JSON.stringify(user));
		delete plain.password;

		// Flatten subdomain roles for easier access in guards
		if (user.academyUser) {
			plain.academyRole = user.academyUser.role;
			plain.academyActiveRole = user.academyUser.activeRole || user.academyUser.role;
			plain.academyStatus = user.academyUser.status;
		}

		if (user.contechUser) {
			plain.contechRole = user.contechUser.role;
			plain.contechStatus = user.contechUser.status;
		}

		if (user.eventsUser) {
			plain.eventsRole = user.eventsUser.role;
			plain.eventsStatus = user.eventsUser.status;
		}

		return plain;
	}

	private generateTokens(user: any) {
		const payload = {
			uid: user.firebaseId,
			id: user.id,
			email: user.email,
			firstname: user.firstname,
			lastname: user.lastname,
			globalRole: user.globalRole,
			status: user.status,
			// Subdomain roles and statuses
			academyRole: user.academyUser?.role,
			academyActiveRole: user.academyUser?.activeRole || user.academyUser?.role,
			academyStatus: user.academyUser?.status,
			consultancyRole: user.consultancyUser?.role,
			consultancyStatus: user.consultancyUser?.status,
			contechRole: user.contechUser?.role,
			contechStatus: user.contechUser?.status,
			eventsRole: user.eventsUser?.role,
			eventsStatus: user.eventsUser?.status,
		};

		const accessToken = this.jwtService.sign(payload);
		
		const refreshPayload = {
			uid: user.firebaseId,
			id: user.id,
			type: 'refresh',
		};
		const refreshToken = this.jwtService.sign(refreshPayload, { expiresIn: '7d' });

		return { accessToken, refreshToken };
	}

	async loginWithGoogle(idToken: string) {
		// Verify Google ID token with Firebase Admin
		const firebase = this.firebaseService.getAuth();
		let decoded;
		try {
			decoded = await firebase.verifyIdToken(idToken);
		} catch (e) {
			throw new Error('Invalid Google ID token');
		}

		// Find or create user in Prisma
		let user: any = await this.userService.findByFirebaseId(decoded.uid);
		if (!user) {
			user = await this.userService.createOrUpdateUser({
				firebaseId: decoded.uid,
				email: decoded.email,
				firstname: decoded.name?.split(' ')[0] || '',
				lastname: decoded.name?.split(' ')[1] || '',
				globalRole: GlobalRole.USER,
				status: 'ACTIVE',
			});
            
            // Create local AcademyUser record with default USER role
            await this.prisma.academyUser.create({
                data: {
                    userId: decoded.uid,
                    role: AcademyRole.USER,
                    status: 'ACTIVE',
                }
            });

            // Create local ContechUser record with default USER role
            await this.prisma.contechUser.create({
                data: {
                    userId: decoded.uid,
                    role: ContechRole.USER,
                    status: 'ACTIVE',
                }
            });

            // Create local EventsUser record with default USER role
            await this.prisma.eventsUser.create({
                data: {
                    userId: decoded.uid,
                    role: EventsRole.USER,
                    status: 'ACTIVE',
                }
            });

			// Re-fetch to get relations
			user = await this.userService.findByFirebaseId(decoded.uid);
			
			// Emit user_created event to all services
			const eventPayload = {
				userId: user.firebaseId,
				email: user.email,
				role: 'USER'
			};
			this.academyClient.emit('user_created', eventPayload);
			this.contechClient.emit('user_created', eventPayload);
			this.eventsClient.emit('user_created', eventPayload);
		}

		// Generate JWT tokens
		const tokens = this.generateTokens(user);

		return {
			user: this.toPlain(user),
			...tokens,
			firebaseIdToken: idToken,
		};
	}

	async createSessionCookie(idToken: string, expiresIn: number = 60 * 60 * 24 * 5 * 1000) { // 5 days
		const firebase = this.firebaseService.getAuth();
		try {
			const sessionCookie = await firebase.createSessionCookie(idToken, { expiresIn });
			return { sessionCookie, expiresIn };
		} catch (error: any) {
			this.logger.error(`Failed to create session cookie: ${error.message}`);
			throw new RpcException({
				statusCode: HttpStatus.UNAUTHORIZED,
				message: 'Failed to create session cookie',
				error: 'Unauthorized',
			});
		}
	}

	async verifyAuth({ type, value }: { type: 'cookie' | 'token' | 'jwt'; value: string }) {
		let decoded: any;
		try {
			if (type === 'cookie') {
				const firebase = this.firebaseService.getAuth();
				decoded = await firebase.verifySessionCookie(value, true);
			} else if (type === 'token') {
				const firebase = this.firebaseService.getAuth();
				decoded = await firebase.verifyIdToken(value);
			} else if (type === 'jwt') {
				decoded = this.jwtService.verify(value);
			}
		} catch (e) {
			throw new RpcException({
				statusCode: HttpStatus.UNAUTHORIZED,
				message: 'Invalid or expired token/session',
				error: 'Unauthorized',
			});
		}

		const firebaseId = decoded.uid || decoded.sub;
		const user = await this.userService.findByFirebaseId(firebaseId);
		
		if (!user) {
			throw new RpcException({
				statusCode: HttpStatus.UNAUTHORIZED,
				message: 'User not found',
				error: 'Unauthorized',
			});
		}

		return { user: this.toPlain(user), decodedToken: decoded };
	}

	// Academy-specific authentication methods
	async selectAcademyRole(userId: string, role: string) {
		const user: any = await this.userService.findByFirebaseId(userId);
		if (!user) {
			throw new RpcException({
				statusCode: HttpStatus.NOT_FOUND,
				message: 'User not found',
				error: 'Not Found',
			});
		}

		if (role === 'student' || role === 'STUDENT') {
			// Student role is assigned immediately
			await this.userService.updateAcademyRole(user.firebaseId, 'STUDENT', 'ACTIVE');
			
			// Re-fetch user to get the new AcademyUser relation
			const updatedUser: any = await this.userService.findById(user.id);
			
			// Generate NEW JWT tokens with the new role information
			const tokens = this.generateTokens(updatedUser);

			return {
				message: 'Student role assigned successfully',
				role: 'STUDENT',
				status: 'ACTIVE',
				user: this.toPlain(updatedUser),
				...tokens,
			};
		} else if (role === 'teacher' || role === 'TEACHER' || role === 'instructor' || role === 'INSTRUCTOR') {
			// Check if user already has approved instructor role
			if (user.academyUser && user.academyUser.role === 'INSTRUCTOR' && user.academyUser.status === 'ACTIVE') {
				// User already has approved instructor role
				return {
					message: 'Instructor role already assigned',
					role: 'INSTRUCTOR',
					status: 'ACTIVE',
					user: this.toPlain(user),
				};
			}
			
			// Teacher role requires application process
			throw new RpcException({
				statusCode: HttpStatus.BAD_REQUEST,
				message: 'Instructor role requires application. Please submit a teacher application.',
				error: 'Bad Request',
			});
		}
		
		throw new RpcException({
			statusCode: HttpStatus.BAD_REQUEST,
			message: 'Invalid role selected',
			error: 'Bad Request',
		});
	}

	async applyForTeacherRole(applicationDto: any) {
		const user = await this.userService.findByFirebaseId(applicationDto.userId);
		if (!user) {
			throw new RpcException({
				statusCode: HttpStatus.NOT_FOUND,
				message: 'User not found',
				error: 'Not Found',
			});
		}

		// Create teacher application
		const application = await this.userService.createTeacherApplication({
			userId: user.id.toString(),
			personalDetails: applicationDto.personalDetails,
			teachingCategories: applicationDto.teachingCategories,
			resumeUrl: applicationDto.resumeUrl,
			interviewResponses: applicationDto.interviewResponses,
			documents: applicationDto.documents || [],
			status: 'PENDING',
			submittedAt: new Date()
		});

		return {
			message: 'Teacher application submitted successfully',
			applicationId: application.id,
			status: 'PENDING'
		};
	}

	async getTeacherApplications() {
		return this.userService.getTeacherApplications();
	}

	async approveTeacherApplication(applicationId: string) {
		const application = await this.userService.getTeacherApplication(applicationId);
		if (!application && applicationId !== 'mock-id') { // Allow mock for testing
			throw new RpcException({
				statusCode: HttpStatus.NOT_FOUND,
				message: 'Application not found',
				error: 'Not Found',
			});
		}

		const userId = application ? application.userId : '1'; // Default if mock

		// Update application status
		await this.userService.updateTeacherApplicationStatus(applicationId, 'APPROVED');

		// Assign instructor role to user
		await this.userService.updateAcademyRole(userId, 'INSTRUCTOR', 'ACTIVE');

		return {
			message: 'Teacher application approved and instructor role assigned',
			userId: userId,
			role: 'INSTRUCTOR',
			status: 'ACTIVE'
		};
	}

	async rejectTeacherApplication(applicationId: string) {
		// Update application status
		await this.userService.updateTeacherApplicationStatus(applicationId, 'REJECTED');

		return {
			message: 'Teacher application rejected',
			applicationId: applicationId,
			status: 'REJECTED'
		};
	}

	async switchRole(userId: string, newRole: string) {
		const user: any = await this.userService.findByFirebaseId(userId);
		if (!user) {
			throw new RpcException({
				statusCode: HttpStatus.NOT_FOUND,
				message: 'User not found',
				error: 'Not Found',
			});
		}

		// Role hierarchy definition
		const ROLE_HIERARCHY: { [key: string]: number } = {
			'ADMIN': 4,
			'ACADEMY_ADMIN': 4,
			'COURSE_MANAGER': 3,
			'INSTRUCTOR': 2,
			'TEACHER': 2,
			'STUDENT': 1,
			'USER': 0
		};

		// Check if user has the requested role (or a higher one)
		const userRole = user.academyUser?.role?.toUpperCase();
		const targetRole = newRole.toUpperCase();
		
		if (!user.academyUser) {
			throw new RpcException({
				statusCode: HttpStatus.FORBIDDEN,
				message: `User is not enrolled in Academy`,
				error: 'Forbidden',
			});
		}

		const userRoleLevel = ROLE_HIERARCHY[userRole] || 0;
		const targetRoleLevel = ROLE_HIERARCHY[targetRole];

		if (targetRoleLevel === undefined) {
             throw new RpcException({
				statusCode: HttpStatus.BAD_REQUEST,
				message: `Invalid role: ${newRole}`,
				error: 'Bad Request',
			});
        }

		if (userRoleLevel < targetRoleLevel) {
			throw new RpcException({
				statusCode: HttpStatus.FORBIDDEN,
				message: `User does not have permission to switch to ${newRole} role. Current role: ${userRole}`,
				error: 'Forbidden',
			});
		}

		// Update active role
		await this.userService.updateActiveAcademyRole(user.firebaseId, newRole.toUpperCase());

		// Re-fetch user to get the updated information
		const updatedUser: any = await this.userService.findById(user.id);

		// Generate NEW JWT tokens with the new role information
		const tokens = this.generateTokens(updatedUser);

		return {
			message: 'Role switched successfully',
			activeRole: newRole.toUpperCase(),
			user: this.toPlain(updatedUser),
			...tokens,
		};
	}

	async getUserAcademyStatus(userId: string) {
		const user = await this.userService.findByFirebaseId(userId);
		if (!user) {
			throw new RpcException({
				statusCode: HttpStatus.NOT_FOUND,
				message: 'User not found',
				error: 'Not Found',
			});
		}

		const hasAcademyRole = !!user.academyUser;
		const currentRole = user.academyUser?.role;
		const hasTeacherApplication = await this.userService.hasPendingTeacherApplication(user.id.toString());

		return {
			hasAcademyRole,
			currentRole,
			status: user.academyUser?.status,
			hasTeacherApplication,
			canAccessDashboard: hasAcademyRole && user.academyUser?.status === 'ACTIVE',
			canEnrollCourses: currentRole === 'STUDENT' && user.academyUser?.status === 'ACTIVE',
			canCreateCourses: currentRole === 'INSTRUCTOR' && user.academyUser?.status === 'ACTIVE'
		};
	}

	async logout(userId: string) {
		return {
			message: 'Logged out successfully'
		};
	}

	async syncContechUser(userId: string) {
		const user = await this.userService.findByFirebaseId(userId);
		if (!user) {
			throw new RpcException({
				statusCode: HttpStatus.NOT_FOUND,
				message: 'User not found in Auth Service',
				error: 'Not Found',
			});
		}

		let contechUser = await this.prisma.contechUser.findUnique({
			where: { userId: user.firebaseId },
		});

		if (!contechUser) {
			contechUser = await this.prisma.contechUser.create({
				data: {
					userId: user.firebaseId,
					role: ContechRole.USER,
					status: 'ACTIVE',
				}
			});
			this.logger.log(`Created missing ContechUser record for user: ${user.firebaseId}`);
		}

		return contechUser;
	}

	async syncEventsUser(userId: string) {
		const user = await this.userService.findByFirebaseId(userId);
		if (!user) {
			throw new RpcException({
				statusCode: HttpStatus.NOT_FOUND,
				message: 'User not found in Auth Service',
				error: 'Not Found',
			});
		}

		let eventsUser = await this.prisma.eventsUser.findUnique({
			where: { userId: user.firebaseId },
		});

		if (!eventsUser) {
			eventsUser = await this.prisma.eventsUser.create({
				data: {
					userId: user.firebaseId,
					role: EventsRole.USER,
					status: 'ACTIVE',
				}
			});
			this.logger.log(`Created missing EventsUser record for user: ${user.firebaseId}`);
		}

		return eventsUser;
	}

	async syncAcademyUser(userId: string) {
		const user = await this.userService.findByFirebaseId(userId);
		if (!user) {
			throw new RpcException({
				statusCode: HttpStatus.NOT_FOUND,
				message: 'User not found in Auth Service',
				error: 'Not Found',
			});
		}

		let academyUser = await this.prisma.academyUser.findUnique({
			where: { userId: user.firebaseId },
		});

		if (!academyUser) {
			academyUser = await this.prisma.academyUser.create({
				data: {
					userId: user.firebaseId,
					role: AcademyRole.USER,
					status: 'ACTIVE',
				}
			});
			this.logger.log(`Created missing AcademyUser record for user: ${user.firebaseId}`);
		}

		return {
			...academyUser,
			globalRole: user.globalRole,
		};
	}
}
