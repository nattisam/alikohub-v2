import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AcademyStatusGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Access denied: User not authenticated');
    }

    // Determine highest available role
    let academyRole = user.academyActiveRole || user.academyUser?.role;
    if (user.academyUser?.role === 'ADMIN' || user.academyUser?.role === 'INSTRUCTOR') {
       academyRole = user.academyUser.role;
    }

    const academyStatus = user.academyStatus || user.academyUser?.status;

    if (!academyRole) {
      throw new ForbiddenException('Access denied: No academy role assigned. Please select a role to continue.');
    }

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

    let academyRole = user.academyActiveRole || user.academyUser?.role;
    // For students, we generally respect the activeRole if they are an instructor switching to student,
    // but here we just need to ensure they have student access.
    
    const academyStatus = user.academyStatus || user.academyUser?.status;

    const isStudent = academyRole?.toUpperCase() === 'STUDENT' || 
                     academyRole?.toUpperCase() === 'USER' || 
                     user.academyUser?.role?.toUpperCase() === 'STUDENT';

    if (!isStudent) {
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

    const academyRole = user.academyActiveRole || user.academyUser?.role;
    const baseRole = user.academyUser?.role;
    const isInstructor = (academyRole?.toUpperCase() === 'INSTRUCTOR') || 
                        (baseRole?.toUpperCase() === 'INSTRUCTOR') ||
                        (academyRole?.toUpperCase() === 'ADMIN') ||
                        (baseRole?.toUpperCase() === 'ADMIN');

    if (!isInstructor) {
      throw new ForbiddenException('Access denied: Instructor role required');
    }

    const academyStatus = user.academyStatus || user.academyUser?.status;
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

    const academyRole = user.academyActiveRole || user.academyUser?.role;
    const baseRole = user.academyUser?.role;
    
    // Check if user is global admin or has instructor/admin role in academy
    const isAdmin = user.globalRole === 'ADMIN' || 
                    academyRole === 'ADMIN' || 
                    baseRole === 'ADMIN' ||
                    academyRole === 'ACADEMY_ADMIN' ||
                    baseRole === 'ACADEMY_ADMIN';
    
    if (!isAdmin) {
      throw new ForbiddenException('Access denied: Admin role required');
    }

    return true;
  }
}
