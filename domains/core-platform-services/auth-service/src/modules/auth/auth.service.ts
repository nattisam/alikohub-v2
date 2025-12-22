
	import { Injectable, Inject } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { SelectRoleDto, TeacherApplicationDto, SwitchRoleDto } from './dto/academy-roles.dto';
import { UserWithAcademy } from './types/user-with-academy.interface';
import { FirebaseService } from '../firebase/firebase.service';
import { UserService } from '../user/user.service';
import { Argon2Service } from './argon2.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private readonly firebaseService: FirebaseService,
		private readonly userService: UserService,
		private readonly argon2Service: Argon2Service,
		private readonly jwtService: JwtService,
	) {}
	async register(dto: SignUpDto) {
		// 1. Create Firebase user first
		let firebaseUser;
		try {
			firebaseUser = await this.firebaseService.getAuth().createUser({
				email: dto.email,
				password: dto.password,
				displayName: `${dto.firstname} ${dto.lastname}`,
			});
		} catch (error) {
			// If user already exists, get existing user
			if (error.code === 'auth/email-already-exists') {
				firebaseUser = await this.firebaseService.getAuth().getUserByEmail(dto.email);
			} else {
				throw new Error(`Failed to create Firebase user: ${error.message}`);
			}
		}

		// 2. Check if user already exists in DB by email (more reliable than Firebase ID)
		const existingUser = await this.userService.findByEmail(dto.email);
		if (existingUser) {
			// User already exists, generate JWT token for existing user
			const payload = {
				uid: existingUser.firebaseId,
				id: existingUser.id,
				email: existingUser.email,
				firstname: existingUser.firstname || 'User',
				lastname: existingUser.lastname || 'User',
				globalRole: existingUser.globalRole,
				status: existingUser.status,
				// Include subdomain roles if present
				...(existingUser.academyUser && { academyRole: existingUser.academyUser.role }),
				...(existingUser.consultancyUser && { consultancyRole: existingUser.consultancyUser.role }),
				...(existingUser.contechUser && { contechRole: existingUser.contechUser.role }),
				...(existingUser.eventsUser && { eventsRole: existingUser.eventsUser.role })
			};

			const accessToken = this.jwtService.sign(payload);
			
			// Generate refresh token with minimal data
			const refreshPayload = {
				uid: existingUser.firebaseId,
				id: existingUser.id,
				type: 'refresh'
			};
			const refreshToken = this.jwtService.sign(refreshPayload);
			
			return {
				message: 'User already exists, returning token',
				user: existingUser,
				accessToken,
				refreshToken
			};
		}

		// 3. Determine global role and subdomain
		let globalRole = 'USER';
		const subdomainData: {
			academyUser?: { create: { role: string; status: string } };
			consultancyUser?: { create: { role: string; status: string } };
			contechUser?: { create: { role: string; status: string } };
			eventsUser?: { create: { role: string; status: string } };
		} = {};

		if (dto.role) {
			// Handle subdomain roles
			if (dto.role.startsWith('ACADEMY_')) {
				globalRole = 'USER';
				const academyRole = dto.role.replace('ACADEMY_', '');
				Object.assign(subdomainData, {
					academyUser: {
						create: {
							role: academyRole === 'ADMIN' ? 'ACADEMY_ADMIN' : academyRole === 'INSTRUCTOR' ? 'INSTRUCTOR' : 'STUDENT',
							status: 'ACTIVE',
						}
					}
				});
			} else if (dto.role.startsWith('CONSULTANCY_')) {
				globalRole = 'USER';
				const consultancyRole = dto.role.replace('CONSULTANCY_', '');
				Object.assign(subdomainData, {
					consultancyUser: {
						create: {
							role: consultancyRole === 'ADVISOR' ? 'ADVISOR' : consultancyRole === 'MANAGER' ? 'CONSULTANCY_ADMIN' : 'STUDENT',
							status: 'ACTIVE',
						}
					}
				});
			} else if (dto.role.startsWith('CONTECH_')) {
				globalRole = 'USER';
				const contechRole = dto.role.replace('CONTECH_', '');
				Object.assign(subdomainData, {
					contechUser: {
						create: {
							role: contechRole === 'DEVELOPER' ? 'CONTRACTOR' : contechRole === 'DESIGNER' ? 'CONTRACTOR' : 'PROJECT_MANAGER',
							status: 'ACTIVE',
						}
					}
				});
			} else if (dto.role.startsWith('EVENTS_')) {
				globalRole = 'USER';
				const eventsRole = dto.role.replace('EVENTS_', '');
				Object.assign(subdomainData, {
					eventsUser: {
						create: {
							role: eventsRole === 'ORGANIZER' ? 'ORGANIZER' : eventsRole === 'PARTICIPANT' ? 'ATTENDEE' : 'SPONSOR',
							status: 'ACTIVE',
						}
					}
				});
			} else if (dto.role === 'ADMIN') {
				globalRole = 'ADMIN';
			}
		}

		// 4. Create user in DB with firebaseId, global role, and subdomain data
		let user;
		try {
			user = await this.userService.createUser({
				email: dto.email,
				firstname: dto.firstname,
				lastname: dto.lastname,
				password: dto.password ? await this.argon2Service.hash(dto.password) : undefined,
				globalRole: globalRole,
				status: 'ACTIVE',
				firebaseId: firebaseUser.uid,
				...(Object.keys(subdomainData).length > 0 ? subdomainData : {})
			});
		} catch (error) {
			// Handle unique constraint error for email
			if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
				throw new Error('Email already exists');
			}
			throw error;
		}

		// 5. Generate JWT token with user data
		let accessToken = '';
		let refreshToken = '';
		try {
			// Prepare user data for JWT payload
			const payload = {
				uid: user.firebaseId,
				id: user.id,
				email: user.email,
				firstname: user.firstname || 'User',
				lastname: user.lastname || 'User',
				globalRole: user.globalRole,
				status: user.status,
				// Include subdomain roles from the subdomainData we used for creation
				...(subdomainData.academyUser && { academyRole: subdomainData.academyUser.create.role }),
				...(subdomainData.consultancyUser && { consultancyRole: subdomainData.consultancyUser.create.role }),
				...(subdomainData.contechUser && { contechRole: subdomainData.contechUser.create.role }),
				...(subdomainData.eventsUser && { eventsRole: subdomainData.eventsUser.create.role })
			};

			accessToken = this.jwtService.sign(payload);
			
			// Generate refresh token with minimal data
			const refreshPayload = {
				uid: user.firebaseId,
				id: user.id,
				type: 'refresh'
			};
			const refreshToken = this.jwtService.sign(refreshPayload);
		} catch (error) {
			throw new Error(`Failed to generate JWT token: ${error.message}`);
		}

		return {
			message: 'User registered successfully',
			user,
			accessToken,
			refreshToken
		};
	}

	async login(dto: SignInDto) {
		// Implement login logic (call signin for now)
		return this.signin(dto);
	}

	async loginWithGoogle(idToken: string) {
		// Implement Google login logic
		return { message: 'Google login not implemented', idToken };
	}

	async refreshTokens(refreshToken: string) {
		try {
			// Verify refresh token
			const decoded = this.jwtService.verify(refreshToken);
			
			// Ensure it's a refresh token
			if (decoded.type !== 'refresh') {
				throw new Error('Invalid refresh token');
			}
			
			// Get user from database
			const user = await this.userService.findByFirebaseId(decoded.uid);
			if (!user) {
				throw new Error('User not found');
			}
			
			// Generate new access token
			const payload = {
				uid: user.firebaseId,
				id: user.id,
				email: user.email,
				firstname: user.firstname || 'User',
				lastname: user.lastname || 'User',
				globalRole: user.globalRole,
				status: user.status,
				// Include subdomain roles if present from the user relationships
				...(user.academyUser && { academyRole: user.academyUser.role }),
				...(user.consultancyUser && { consultancyRole: user.consultancyUser.role }),
				...(user.contechUser && { contechRole: user.contechUser.role }),
				...(user.eventsUser && { eventsRole: user.eventsUser.role })
			};
			
			const newAccessToken = this.jwtService.sign(payload);
			
			// Generate new refresh token
			const refreshPayload = {
				uid: user.firebaseId,
				id: user.id,
				type: 'refresh'
			};
			const newRefreshToken = this.jwtService.sign(refreshPayload);
			
			return {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken
			};
		} catch (error) {
			throw new Error('Invalid refresh token');
		}
	}

	async signin(dto: SignInDto) {
		// Find user by email with subdomain relationships
		const user = await this.userService.findByEmail(dto.email);
		
		if (!user) {
			throw new Error('User not found');
		}

		
		try {
			// Prepare user data for JWT payload
			const payload = {
				uid: user.firebaseId,
				id: user.id,
				email: user.email,
				firstname: user.firstname || 'User',
				lastname: user.lastname || 'User',
				globalRole: user.globalRole,
				status: user.status,
				// Include subdomain roles if present from the user relationships
				...(user.academyUser && { academyRole: user.academyUser.role }),
				...(user.consultancyUser && { consultancyRole: user.consultancyUser.role }),
				...(user.contechUser && { contechRole: user.contechUser.role }),
				...(user.eventsUser && { eventsRole: user.eventsUser.role })
			};

			const accessToken = this.jwtService.sign(payload);
			
			// Generate refresh token with minimal data
			const refreshPayload = {
				uid: user.firebaseId,
				id: user.id,
				type: 'refresh'
			};
			const refreshToken = this.jwtService.sign(refreshPayload);
			
			// Filter out null subdomain user data for response
			const subdomainData: {
				consultancyUser?: any;
				academyUser?: any;
				contechUser?: any;
				eventsUser?: any;
			} = {};
			if (user.consultancyUser) subdomainData.consultancyUser = user.consultancyUser;
			if (user.academyUser) subdomainData.academyUser = user.academyUser;
			if (user.contechUser) subdomainData.contechUser = user.contechUser;
			if (user.eventsUser) subdomainData.eventsUser = user.eventsUser;
			
			return {
				accessToken: accessToken,
				refreshToken: refreshToken,
				user: {
					id: user.id,
					email: user.email,
					firstname: user.firstname || 'User',
					lastname: user.lastname || 'User',
					globalRole: user.globalRole,
					status: user.status,
					...subdomainData
				}
			};
		} catch (error) {
			throw new Error(`Failed to generate JWT token: ${error.message}`);
		}
	}

	// Academy-specific authentication methods
	async selectAcademyRole(userId: string, role: 'student' | 'teacher') {
		const user = await this.userService.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}

		if (role === 'student') {
			// Student role is assigned immediately
			await this.userService.updateAcademyRole(user.id, 'STUDENT', 'ACTIVE');
			return {
				message: 'Student role assigned successfully',
				role: 'STUDENT',
				status: 'ACTIVE'
			};
		} else if (role === 'teacher') {
			// Teacher role requires application process
			throw new Error('Teacher role requires application. Please submit a teacher application.');
		}
	}

	async applyForTeacherRole(applicationDto: TeacherApplicationDto) {
		const user = await this.userService.findById(applicationDto.userId);
		if (!user) {
			throw new Error('User not found');
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
		if (!application) {
			throw new Error('Application not found');
		}

		// Update application status
		await this.userService.updateTeacherApplicationStatus(applicationId, 'APPROVED');

		// Assign teacher role to user
		await this.userService.updateAcademyRole(application.userId, 'TEACHER', 'ACTIVE');

		// Send notification to user (implement notification service later)
		// await this.notificationService.sendTeacherApprovalNotification(application.userId);

		return {
			message: 'Teacher application approved and role assigned',
			userId: application.userId,
			role: 'TEACHER',
			status: 'ACTIVE'
		};
	}

	async rejectTeacherApplication(applicationId: string) {
		const application = await this.userService.getTeacherApplication(applicationId);
		if (!application) {
			throw new Error('Application not found');
		}

		// Update application status
		await this.userService.updateTeacherApplicationStatus(applicationId, 'REJECTED');

		// Send notification to user (implement notification service later)
		// await this.notificationService.sendTeacherRejectionNotification(application.userId);

		return {
			message: 'Teacher application rejected',
			applicationId: applicationId,
			status: 'REJECTED'
		};
	}

	async switchRole(userId: string, newRole: 'student' | 'teacher') {
		const user = await this.userService.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}

		// Check if user has the requested role
		if (!user.academyUser || (user.academyUser.role !== newRole.toUpperCase() && user.academyUser.role !== newRole)) {
			throw new Error(`User does not have ${newRole} role`);
		}

		// Update active role
		await this.userService.updateActiveAcademyRole(user.id, newRole.toUpperCase());

		// Generate new JWT with updated role
		const payload = {
			uid: user.firebaseId,
			id: user.id,
			email: user.email,
			firstname: user.firstname || 'User',
			lastname: user.lastname || 'User',
			globalRole: user.globalRole,
			status: user.status,
			academyRole: newRole.toUpperCase(),
			activeRole: newRole.toUpperCase()
		};

		const newAccessToken = this.jwtService.sign(payload);
		
		// Generate new refresh token
		const refreshPayload = {
			uid: user.firebaseId,
			id: user.id,
			type: 'refresh'
		};
		const newRefreshToken = this.jwtService.sign(refreshPayload);

		return {
			message: 'Role switched successfully',
			activeRole: newRole.toUpperCase(),
			accessToken: newAccessToken,
			refreshToken: newRefreshToken
		};
	}

	async getUserAcademyStatus(userId: string) {
		const user = await this.userService.findById(userId);
		if (!user) {
			throw new Error('User not found');
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
			canCreateCourses: currentRole === 'TEACHER' && user.academyUser?.status === 'ACTIVE'
		};
	}

	async logout(userId: string) {
		// Invalidate user sessions (implement session management)
		// For now, just return success - JWT will be invalidated on client side
		return {
			message: 'Logged out successfully'
		};
	}
}
