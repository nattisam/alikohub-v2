
	import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { UserService } from '../user/user.service';
import { Argon2Service } from './argon2.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly firebaseService: FirebaseService,
		private readonly userService: UserService,
		private readonly argon2Service: Argon2Service,
	) {}
	async register(dto: SignUpDto) {
		// Implement registration logic
		return { message: 'User registered', dto };
	}

	async registerSubdomain(dto: any) {
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

		// 2. Check if user already exists in DB
		const existingUser = await this.userService.findByFirebaseId(firebaseUser.uid);
		if (existingUser) {
			// User already exists, generate token for existing user
			const accessToken = await this.firebaseService.getAuth().createCustomToken(existingUser.firebaseId);
			return {
				message: 'User already exists, returning token',
				user: existingUser,
				accessToken
			};
		}

		// 3. Create user in DB with firebaseId
		const user = await this.userService.createUser({
			email: dto.email,
			firstname: dto.firstname,
			lastname: dto.lastname,
			password: dto.password ? await this.argon2Service.hash(dto.password) : undefined,
			globalRole: 'USER',
			status: 'ACTIVE',
			firebaseId: firebaseUser.uid,
		});

		// 4. Generate Firebase custom token
		let accessToken = '';
		try {
			accessToken = await this.firebaseService.getAuth().createCustomToken(user.firebaseId);
		} catch (error) {
			throw new Error(`Failed to generate custom token: ${error.message}`);
		}

		return {
			message: 'Subdomain user registered',
			user,
			accessToken
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

	async signin(dto: SignInDto) {
		// Find user by email with subdomain relationships
		const user = await this.userService.findByEmail(dto.email);
		
		if (!user) {
			throw new Error('User not found');
		}

		
		try {
			const customToken = await this.firebaseService.getAuth().createCustomToken(user.firebaseId);
			
			// Filter out null subdomain user data
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
				accessToken: customToken,
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
			throw new Error(`Failed to generate custom token: ${error.message}`);
		}
	}
}
