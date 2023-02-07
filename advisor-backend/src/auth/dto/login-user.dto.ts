import { PickType } from '@nestjs/swagger';
import { AuthenticationDto } from './authentication.dto';

/**
 * Response with login information
 */
export class LoginDto extends PickType(AuthenticationDto, [
  'username',
  'password',
] as const) { }
