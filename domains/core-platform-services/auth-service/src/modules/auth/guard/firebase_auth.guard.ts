import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException('No token provided');
		}

		try {
			// Verify JWT token
			const decodedToken = this.jwtService.verify(token);
			
			// Get user from database with subdomain relationships
			const user = await this.userService.findByFirebaseId(decodedToken.uid);
			
			if (!user) {
				throw new UnauthorizedException('User not found');
			}

			// Attach user and token data to request
			request.user = user;
			request.tokenData = decodedToken;
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
