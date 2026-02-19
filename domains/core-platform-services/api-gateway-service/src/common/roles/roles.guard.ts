import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

enum GlobalRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

import { AuthenticatedUser } from '../types/request-with-user.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<GlobalRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    console.log('Required roles for this route:', requiredRoles);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;

    if (!user || !user.globalRole) {
      console.log('❌ No user or user.globalRole found, denying access.');
      return false;
    }

    const hasAccess = requiredRoles.some((role) => user.globalRole === role);

    console.log(
      `User globalRole = ${user.globalRole}, Allowed roles = ${requiredRoles}, Access = ${hasAccess}`,
    );

    return hasAccess;
  }
}
