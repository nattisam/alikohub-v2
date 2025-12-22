import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export enum AcademyRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ACADEMY_ADMIN = 'ACADEMY_ADMIN',
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
    
    if (!user || !user.academyRole) {
      return false; // No user or no academy role
    }

    const userRole = user.academyRole.toUpperCase();
    const hasRole = requiredRoles.some(role => role === userRole);

    // Academy admin can access everything
    if (userRole === AcademyRole.ACADEMY_ADMIN) {
      return true;
    }

    return hasRole;
  }
}
