import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

/**
 * Guard used for authentication
 */
export class AuthGuard extends PassportAuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  // decides whether an authentication request is authorized or not
  canActivate(context: ExecutionContext) {
    const isUnauthorized = this.reflector.get<boolean>(
      'isUnauthorized',
      context.getHandler()
    );

    // returns true if not authorized
    if (isUnauthorized) {
      return true;
    }

    return super.canActivate(context);
  }
}
