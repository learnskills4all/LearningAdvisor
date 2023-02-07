import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';

/**
 * Response with User information
 */
export class UpdateUserDto {
  @ApiProperty()
  @IsEnum(Role)
  role: Role;
}
