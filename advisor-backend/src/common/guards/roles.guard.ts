import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard used for authorization
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  // decides whether an authorization request is allowed for a specific role
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    // returns true if not authorized
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return roles.includes(user.role);
  }

  // checks whether the specific role is included in the array of roles
  matchRoles(roles: string[], role: Role): boolean {
    return roles.includes(role);
  }
}
