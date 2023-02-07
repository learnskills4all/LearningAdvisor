import { User } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';

// DTO for user login response
// ApiProperty is used for the swagger documentation
export class AuthResponse {
  @ApiProperty()
  token: string;
  @ApiProperty()
  user: User;
}
