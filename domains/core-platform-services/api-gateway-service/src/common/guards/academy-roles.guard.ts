import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export enum AcademyRole {
  USER = 'USER',
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  TEACHER = 'TEACHER', // Keep for backward compatibility if needed
  ADMIN = 'ADMIN',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AcademyRole[]) => {
  return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    // This will be used by the Reflector to get the required roles
    if (propertyKey) {
      Reflect.defineMetadata(ROLES_KEY, roles, target, propertyKey);
    } else {
      Reflect.defineMetadata(ROLES_KEY, roles, target);
    }
  };
};

@Injectable()
export class AcademyRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AcademyRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required
    }

    const { user } = context.switchToHttp().getRequest();
    
    const academyRole = user.academyActiveRole || user.academyRole || user.academyUser?.role;
    
    if (!user || !academyRole) {
      return false; // No user or no academy role
    }

    const userRole = academyRole.toUpperCase();
    
    // Support both INSTRUCTOR and TEACHER naming during transition
    const effectiveRoles = [userRole];
    if (userRole === 'INSTRUCTOR') effectiveRoles.push('TEACHER');
    if (userRole === 'TEACHER') effectiveRoles.push('INSTRUCTOR');

    const hasRole = requiredRoles.some(role => effectiveRoles.includes(role));

    // Academy admin can access everything
    if (userRole === AcademyRole.ADMIN || userRole === 'ADMIN' || userRole === 'ACADEMY_ADMIN') {
      return true;
    }

    return hasRole;
  }
}
