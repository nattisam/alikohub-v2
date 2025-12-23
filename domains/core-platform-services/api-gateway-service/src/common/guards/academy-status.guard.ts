import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AcademyStatusGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Access denied: User not authenticated');
    }

    // Check if user has any academy role
    if (!user.academyRole) {
      throw new ForbiddenException('Access denied: No academy role assigned. Please select a role to continue.');
    }

    // Check if user's academy role is active
    if (user.academyStatus !== 'ACTIVE') {
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

    if (!user.academyRole || (user.academyRole.toUpperCase() !== 'STUDENT' && user.academyRole.toUpperCase() !== 'USER')) {
      throw new ForbiddenException('Access denied: Student role required');
    }

    if (user.academyStatus !== 'ACTIVE') {
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

    if (!user.academyRole || (user.academyRole.toUpperCase() !== 'INSTRUCTOR' && user.academyRole.toUpperCase() !== 'TEACHER')) {
      throw new ForbiddenException('Access denied: Instructor role required');
    }

    if (user.academyStatus !== 'ACTIVE') {
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

    // Check if user is global admin or academy admin
    const isAdmin = user.globalRole === 'ADMIN' || user.academyRole === 'ADMIN' || user.academyRole === 'ACADEMY_ADMIN';
    
    if (!isAdmin) {
      throw new ForbiddenException('Access denied: Admin role required');
    }

    return true;
  }
}
