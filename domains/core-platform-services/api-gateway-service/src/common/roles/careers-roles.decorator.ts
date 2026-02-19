import { SetMetadata } from '@nestjs/common';

export const CAREERS_ROLES_KEY = 'careers_roles';
export const CareersRoles = (...roles: string[]) => SetMetadata(CAREERS_ROLES_KEY, roles);
