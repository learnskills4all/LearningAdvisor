import { ApiProperty } from '@nestjs/swagger';
import { AssessmentParticipants, Role, UserInTeam } from '@prisma/client';
import { IsIn, IsString } from 'class-validator';

/**
 * Response with authentication information
 * Used as template by other authentication dtos
 */
export class AuthenticationDto {
  @ApiProperty({ default: 'bf30b88f-a641-4194-9c5a-95b801884440' })
  password: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @IsString()
  @ApiProperty({ default: 'username' })
  username: string;

  @ApiProperty({ default: 1 })
  user_id: number;

  @IsIn([Role.USER, Role.ASSESSOR])
  @ApiProperty({ default: Role.USER })
  role: Role;

  @ApiProperty()
  AssessmentParticipants: AssessmentParticipants[];

  @ApiProperty()
  UserInTeam: UserInTeam[];
}
