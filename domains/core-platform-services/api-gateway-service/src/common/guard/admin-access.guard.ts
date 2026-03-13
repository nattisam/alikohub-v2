import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.globalRole !== 'ADMIN') {
      throw new UnauthorizedException('Only administrators can access this resource');
    }

    return true;
  }
}
