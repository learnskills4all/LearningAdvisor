import { PickType } from '@nestjs/swagger';
import { AuthenticationDto } from './authentication.dto';

/**
 * Response with registration information
 */
export class CreateUserDto extends PickType(AuthenticationDto, [
  'role',
] as const) { }
