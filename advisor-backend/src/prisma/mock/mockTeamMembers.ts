import { Role } from '@prisma/client';

export const aTeamMembers = {
  team_members: [
    {
      user_id: 1,
      username: 'test_user_name',
      role: Role.ASSESSOR,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
};
