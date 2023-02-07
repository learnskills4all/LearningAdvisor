import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { aTeamMembers } from '../../prisma/mock/mockTeamMembers';

// Data transfer object for TeamMembers
export class TeamMembers {
  // Used for the swagger documentation
  @ApiProperty({
    // Example of a team member dto for the swagger documentation
    example: aTeamMembers.team_members,
  })
  // The team member object
  team_members: {
    user_id: number;
    username: string;
    role: Role;
    created_at: Date;
    updated_at: Date;
  }[];
}
