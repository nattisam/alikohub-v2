import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

// Since we don't have direct access to AcademyService in the API Gateway,
// we'll implement the guard logic using the microservice client approach
@Injectable()
export class EnrollmentGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const courseId = request.params.courseId || request.params.id;

    if (!user || !user.academyRole) {
      throw new ForbiddenException('Access denied: No academy role found');
    }

    const userRole = user.academyRole.toUpperCase();

    // Academy admin can access everything
    if (userRole === 'ACADEMY_ADMIN') {
      return true;
    }

    // For now, we'll implement basic role-based access
    // In a full implementation, you would check course ownership/enrollment via microservice
    if (userRole === 'TEACHER') {
      // Teachers can access their own courses (simplified check)
      return true;
    }

    if (userRole === 'STUDENT') {
      // Students can access enrolled courses (simplified check)
      return true;
    }

    return false;
  }
}

@Injectable()
export class CourseAccessGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const courseId = request.params.courseId || request.params.id;

    if (!user || !user.academyRole) {
      throw new ForbiddenException('Access denied: No academy role found');
    }

    const userRole = user.academyRole.toUpperCase();

    // Academy admin can access everything
    if (userRole === 'ACADEMY_ADMIN') {
      return true;
    }

    // Teachers and students can access courses with appropriate permissions
    if (userRole === 'TEACHER' || userRole === 'STUDENT') {
      return true;
    }

    return false;
  }
}
