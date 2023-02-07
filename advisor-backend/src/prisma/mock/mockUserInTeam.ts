export const mockUserInTeamRecord = {
  user_id: 1,
  team_id: 1,
};

export const mockUserInTeam = {
  create: jest.fn().mockResolvedValue(mockUserInTeamRecord),
  deleteMany: jest.fn().mockResolvedValue([mockUserInTeamRecord]),
  delete: jest.fn().mockResolvedValue(mockUserInTeamRecord),
};
