import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AcademyStatusGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Access denied: User not authenticated');
    }

    // Use activeRole from JWT for role switching support
    const academyRole = user.academyActiveRole || user.academyUser?.role;
    const academyStatus = user.academyStatus || user.academyUser?.status;

    // Check if user has any academy role
    if (!academyRole) {
      throw new ForbiddenException('Access denied: No academy role assigned. Please select a role to continue.');
    }

    // Check if user's academy role is active
    if (academyStatus !== 'ACTIVE') {
      throw new ForbiddenException('Access denied: Academy account is not active');
    }

    return true;
  }
}

@Injectable()
export class StudentAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Access denied: User not authenticated');
    }

    // Use activeRole from JWT for role switching support
    const academyRole = user.academyActiveRole || user.academyUser?.role;
    const academyStatus = user.academyStatus || user.academyUser?.status;

    if (!academyRole || (academyRole.toUpperCase() !== 'STUDENT' && academyRole.toUpperCase() !== 'USER')) {
      throw new ForbiddenException('Access denied: Student role required');
    }

    if (academyStatus !== 'ACTIVE') {
      throw new ForbiddenException('Access denied: Student account is not active');
    }

    return true;
  }
}

@Injectable()
export class TeacherAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Access denied: User not authenticated');
    }

    // Use activeRole from JWT for role switching support
    const academyRole = user.academyActiveRole || user.academyUser?.role;
    const academyStatus = user.academyStatus || user.academyUser?.status;

    if (!academyRole || (academyRole.toUpperCase() !== 'INSTRUCTOR' && academyRole.toUpperCase() !== 'TEACHER')) {
      throw new ForbiddenException('Access denied: Instructor role required');
    }

    if (academyStatus !== 'ACTIVE') {
      throw new ForbiddenException('Access denied: Instructor account is not active');
    }

    return true;
  }
}

@Injectable()
export class AdminAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Access denied: User not authenticated');
    }

    // Use activeRole from JWT for role switching support
    const academyRole = user.academyActiveRole || user.academyUser?.role;

    // Check if user is global admin or academy admin
    const isAdmin = user.globalRole === 'ADMIN' || academyRole === 'ADMIN' || academyRole === 'ACADEMY_ADMIN';
    
    if (!isAdmin) {
      throw new ForbiddenException('Access denied: Admin role required');
    }

    return true;
  }
}
