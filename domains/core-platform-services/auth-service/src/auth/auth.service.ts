import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { FirebaseService } from '../firebase/firebase.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private readonly userService: UserService,
		private readonly firebaseService: FirebaseService,
		private readonly prisma: PrismaService,
	) {}

	async register(dto: any) {
		// Register user with Firebase Auth (email/password)
		const firebase = this.firebaseService.getAuth();
		let userRecord;
		try {
			userRecord = await firebase.createUser({
				email: dto.email,
				password: dto.password,
				displayName: dto.firstname + (dto.lastname ? ' ' + dto.lastname : ''),
			});
		} catch (e) {
			if (e.code === 'auth/email-already-exists') {
				throw new Error('User already exists');
			}
			throw e;
		}

		// Create user in Prisma if not exists
		let user = await this.userService.findByFirebaseId(userRecord.uid);
		if (!user) {
			user = await this.userService.createUser({
				firebaseId: userRecord.uid,
				email: userRecord.email,
				firstname: dto.firstname,
				lastname: dto.lastname,
				globalRole: 'USER',
				status: 'ACTIVE',
			});
		}

		// Issue Firebase ID token
		const customToken = await firebase.createCustomToken(userRecord.uid);
		// Client exchanges customToken for ID token on frontend
		return {
			user,
			firebaseCustomToken: customToken,
		};
	}

	async login(dto: any) {
		this.logger.log(`Login attempt for email: ${dto.email}`);
		
		// Login user with Firebase Auth (email/password)
		const firebase = this.firebaseService.getAuth();
		let userRecord;
		try {
			this.logger.log(`Looking up user by email: ${dto.email}`);
			// Firebase Admin SDK does not support password login directly.
			// In production, the client should use Firebase client SDK to get ID token, then send to backend.
			// For demo, we simulate by looking up user and issuing custom token.
			userRecord = await firebase.getUserByEmail(dto.email);
			this.logger.log(`Found Firebase user: ${userRecord.uid} for email: ${dto.email}`);
		} catch (e) {
			this.logger.error(`Failed to find user by email: ${dto.email}`, e);
			throw new Error('Invalid credentials');
		}

		// Find or create user in Prisma
		let user = await this.userService.findByFirebaseId(userRecord.uid);
		if (!user) {
			this.logger.log(`User not found in database, creating new user for Firebase ID: ${userRecord.uid}`);
			user = await this.userService.createOrUpdateUser({
				firebaseId: userRecord.uid,
				email: userRecord.email,
				firstname: userRecord.displayName?.split(' ')[0] || '',
				lastname: userRecord.displayName?.split(' ')[1] || '',
				globalRole: 'USER',
				status: 'ACTIVE',
			});
			this.logger.log(`Created new user in database: ${user.id}`);
		} else {
			this.logger.log(`Found existing user in database: ${user.id}`);
		}

		// Issue Firebase custom token
		this.logger.log(`Issuing custom token for user: ${userRecord.uid}`);
		const customToken = await firebase.createCustomToken(userRecord.uid);
		// Client exchanges customToken for ID token on frontend
		this.logger.log(`Login successful for user: ${user.id}`);
		
		return {
			user,
			firebaseCustomToken: customToken,
		};
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
		let user = await this.userService.findByFirebaseId(decoded.uid);
		if (!user) {
			user = await this.userService.createOrUpdateUser({
				firebaseId: decoded.uid,
				email: decoded.email,
				firstname: decoded.name?.split(' ')[0] || '',
				lastname: decoded.name?.split(' ')[1] || '',
				globalRole: 'USER',
				status: 'ACTIVE',
			});
		}

		// Optionally issue a new custom token (not strictly needed if client already has ID token)
		// const customToken = await firebase.createCustomToken(decoded.uid);

		return {
			user,
			firebaseIdToken: idToken,
		};
	}

	async verify(token: string) {
		// Verify Firebase ID token
		const firebase = this.firebaseService.getAuth();
		let decoded;
		try {
			decoded = await firebase.verifyIdToken(token);
		} catch (e) {
			throw new Error('Invalid or expired token');
		}

		// Find user in Prisma - if not found, create a mock user for testing
		let user = await this.userService.findByFirebaseId(decoded.uid);
		if (!user) {
			// Create user if not found (for testing purposes)
			user = await this.userService.createOrUpdateUser({
				firebaseId: decoded.uid,
				email: decoded.email,
				firstname: decoded.name?.split(' ')[0] || 'Test',
				lastname: decoded.name?.split(' ')[1] || 'User',
				globalRole: 'USER',
				status: 'ACTIVE',
			});
		}

		return {
			user,
			decodedToken: decoded,
		};
	}
}
