import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';

/**
 * Response with user information
 */
export class userResponse {
  @ApiProperty({ default: 1 })
  user_id: number;

  @ApiProperty({ default: 'username' })
  username: string;

  @ApiProperty({ default: Role.USER, enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
