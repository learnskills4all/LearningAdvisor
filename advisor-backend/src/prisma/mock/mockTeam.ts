import { InviteTokenDto } from '../../teams/dto/invite-token.dto';
import { aAssessment } from './mockAssessment';

export const aTeam = {
  team_id: 1,
  team_name: 'test_team_name',
  invite_token: 'test_invite_token',
  team_country: 'test_team_country',
  team_department: 'test_team_department',
  UserInTeam: [
    {
      user_id: 1,
      team_id: 1,
    },
  ],
};

export const aTeamOtherMembers = {
  team_id: 1,
  team_name: 'test_team_name',
  invite_token: 'test_invite_token',
  team_country: 'test_team_country',
  team_department: 'test_team_department',
  UserInTeam: [
    {
      user_id: 2,
      team_id: 1,
    },
  ],
};

export const aTeamNoMembers = {
  team_id: 1,
  team_name: 'test_team_name',
  invite_token: 'test_invite_token',
  team_country: 'test_team_country',
  team_department: 'test_team_department',
  UserInTeam: [],
};

export const aTeamNoMembers1 = {
  team_id: 1,
  team_name: 'test_team_name',
  invite_token: 'test_invite_token',
  team_country: 'test_team_country',
  team_department: 'test_team_department',
};

export const mockCreateTeamResponse = {
  team_id: 1,
  team_name: 'New Team',
  invite_token: 'test_invite_token',
  team_country: '',
  team_department: '',
};

export const aTeamWithAssessment = {
  ...aTeam,
  Assessment: [aAssessment],
};

export const aUpdateTeam = {
  team_name: 'test_team_name',
  team_country: 'test_team_country',
  team_department: 'test_team_department',
};

export const aCreateTeam = {
  team_name: 'New Team',
  team_country: '',
  team_department: '',
};

export const aInviteToken = {
  invite_token: 'test_invite_token',
} as InviteTokenDto;

export const mockTeam = {
  create: jest.fn().mockResolvedValue(aCreateTeam),
  findUnique: jest.fn().mockResolvedValue(aTeam),
  findOne: jest.fn().mockResolvedValue(aTeam),
  findMany: jest.fn().mockResolvedValue([aTeam]),
  getAssessments: jest.fn().mockResolvedValue([aAssessment]),
  update: jest.fn().mockResolvedValue(aTeam),
  delete: jest.fn().mockResolvedValue(aTeam),
};
