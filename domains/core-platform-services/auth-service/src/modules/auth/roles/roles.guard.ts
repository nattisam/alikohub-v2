import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check global role
    if (roles.includes(user.globalRole)) {
      return true;
    }

    // Check subdomain roles (e.g., 'ACADEMY_ADMIN', 'CONSULTANCY_ADVISOR', etc.)
    // Convention: role string starts with subdomain, e.g., 'ACADEMY_ADMIN', 'CONSULTANCY_ADVISOR'
    for (const requiredRole of roles) {
      const [subdomain, ...roleParts] = requiredRole.split('_');
      if (roleParts.length === 0) continue;
      const subdomainKey = subdomain.toLowerCase() + 'User';
      if (user[subdomainKey] && user[subdomainKey].role === roleParts.join('_')) {
        return true;
      }
    }

    throw new ForbiddenException('Insufficient permissions');
  }
}
