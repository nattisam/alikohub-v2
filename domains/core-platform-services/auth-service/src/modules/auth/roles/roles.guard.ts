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
    const tokenData = request.tokenData;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check global role first
    if (roles.includes(user.globalRole)) {
      return true;
    }

    // Check subdomain roles from database user relationships
    for (const requiredRole of roles) {
      if (requiredRole.startsWith('ACADEMY_') && user.academyUser) {
        const subdomainRole = 'ACADEMY_' + user.academyUser.role;
        if (subdomainRole === requiredRole) {
          return true;
        }
      }
      if (requiredRole.startsWith('CONSULTANCY_') && user.consultancyUser) {
        const subdomainRole = 'CONSULTANCY_' + user.consultancyUser.role;
        if (subdomainRole === requiredRole) {
          return true;
        }
      }
      if (requiredRole.startsWith('CONTECH_') && user.contechUser) {
        const subdomainRole = 'CONTECH_' + user.contechUser.role;
        if (subdomainRole === requiredRole) {
          return true;
        }
      }
      if (requiredRole.startsWith('EVENTS_') && user.eventsUser) {
        const subdomainRole = 'EVENTS_' + user.eventsUser.role;
        if (subdomainRole === requiredRole) {
          return true;
        }
      }
    }

    // Check subdomain roles from JWT token data (fallback if database relationships not loaded)
    if (tokenData) {
      for (const requiredRole of roles) {
        if (requiredRole.startsWith('ACADEMY_') && tokenData.academyRole) {
          // Direct comparison since JWT token contains the full role name
          if (tokenData.academyRole === requiredRole) {
            return true;
          }
        }
        if (requiredRole.startsWith('CONSULTANCY_') && tokenData.consultancyRole) {
          // Direct comparison since JWT token contains the full role name
          if (tokenData.consultancyRole === requiredRole) {
            return true;
          }
        }
        if (requiredRole.startsWith('CONTECH_') && tokenData.contechRole) {
          // Direct comparison since JWT token contains the full role name
          if (tokenData.contechRole === requiredRole) {
            return true;
          }
        }
        if (requiredRole.startsWith('EVENTS_') && tokenData.eventsRole) {
          // Direct comparison since JWT token contains the full role name
          if (tokenData.eventsRole === requiredRole) {
            return true;
          }
        }
      }
    }

    throw new ForbiddenException('Insufficient permissions');
  }
}
