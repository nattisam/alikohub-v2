import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
	constructor(
		private readonly firebaseService: FirebaseService,
		private readonly userService: UserService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException('No token provided');
		}

		try {
			// Verify Firebase ID token
			const decodedToken = await this.firebaseService.getAuth().verifyIdToken(token);
			
			// Get user from database with subdomain relationships
			const user = await this.userService.findByFirebaseId(decodedToken.uid);
			
			if (!user) {
				throw new UnauthorizedException('User not found');
			}

			// Attach user to request
			request.user = user;
			return true;
		} catch (error) {
			throw new UnauthorizedException('Invalid token');
		}
	}

	private extractTokenFromHeader(request: any): string | undefined {
		const authHeader = request.headers.authorization;
		if (authHeader && authHeader.startsWith('Bearer ')) {
			return authHeader.substring(7);
		}
		return undefined;
	}
}
