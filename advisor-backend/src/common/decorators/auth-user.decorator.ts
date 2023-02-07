import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '.prisma/client';

/**
 * Parameter Decorator used for authentication
 */
const AuthUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  // retrieve the user
  const user = request.user as User;

  // remove the password
  delete user.password;
  return user;
});

export default AuthUser;
