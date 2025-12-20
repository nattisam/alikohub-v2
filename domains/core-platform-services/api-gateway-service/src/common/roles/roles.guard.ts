import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

// This is the enum for GLOBAL roles from the auth-service.
// It's best to define this in a shared library.
enum GlobalRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// The shape of the user object attached by the AuthGuard
type AuthenticatedUser = {
  firebaseId: string;
  globalRole: GlobalRole; // <-- FIXED: use globalRole, not role
};

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
