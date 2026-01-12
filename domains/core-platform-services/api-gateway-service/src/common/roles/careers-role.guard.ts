import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CAREERS_ROLES_KEY } from './careers-roles.decorator';
import { AuthenticatedUser } from '../types/request-with-user.interface';

@Injectable()
export class CareersRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      CAREERS_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;

    if (!user || !user.careersUser || !user.careersUser.role) {
      // If user is ADMIN globally, allow access? 
      // Usually Global ADMIN should override.
      if (user && user.globalRole === 'ADMIN') {
        return true;
      }
      return false;
    }

    // Check if user has one of the required roles
    return requiredRoles.includes(user.careersUser.role);
  }
}
