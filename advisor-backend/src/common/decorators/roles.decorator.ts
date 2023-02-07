import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

/**
 * Roles Decorator used for authorization
 */
export const ROLES_KEY = 'role';
export const Roles = (...role: Role[]) => SetMetadata(ROLES_KEY, role);
