import { Test } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import {
  aInviteToken,
  aTeam,
  aTeamNoMembers,
  aTeamWithAssessment,
} from '../prisma/mock/mockTeam';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { PrismaService } from '../prisma/prisma.service';
import { aAssessment } from '../prisma/mock/mockAssessment';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { aUser1 } from '../prisma/mock/mockUser';

const moduleMocker = new ModuleMocker(global);

describe('TeamsService', () => {
  let teamsService: TeamsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    process.env = {
      DATABASE_URL: 'postgres://localhost:5432/test',
      JWT_SECRET: 'mycustomuselongsecret',
      EXPIRESIN: '60 days',
    };

    const moduleRef = await Test.createTestingModule({
      providers: [TeamsService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return mockPrisma;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    teamsService = moduleRef.get<TeamsService>(TeamsService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(teamsService).toBeDefined();
  });

  describe('getTeamMembers', () => {
    it('Should return the team members', async () => {
      jest.spyOn(prisma.user, 'findMany').mockResolvedValueOnce([aUser1]);
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValueOnce(aTeam);
      expect(teamsService.findTeamMembers(1)).resolves.toHaveProperty(
        'team_members[0].username',
        'test_username'
      );
    });

    it('Should return empty array if there are no team members', async () => {
      jest
        .spyOn(prisma.team, 'findUnique')
        .mockResolvedValueOnce(aTeamNoMembers);
      expect(teamsService.findTeamMembers(1)).resolves.toStrictEqual({
        team_members: [],
      });
    });

    it('Should return the team members', async () => {
      jest.spyOn(prisma.user, 'findMany').mockResolvedValueOnce([aUser1]);
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValueOnce(aTeam);
      expect(teamsService.findTeamMembers(1)).resolves.toHaveProperty(
        'team_members[0].role',
        'USER'
      );
    });

    it('Should reject if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValueOnce(null);
      expect(teamsService.findTeamMembers(2)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('addTeamMember', () => {
    it('Should return the team members', async () => {
      jest.spyOn(prisma.user, 'findMany').mockResolvedValueOnce([aUser1]);
      expect(
        teamsService.addTeamMember(aUser1, 'test_invite_token')
      ).resolves.toHaveProperty('team_members[0].username', 'test_username');
    });

    it('Should return the team members', async () => {
      jest.spyOn(prisma.user, 'findMany').mockResolvedValueOnce([aUser1]);
      expect(
        teamsService.addTeamMember(aUser1, 'test_invite_token')
      ).resolves.toHaveProperty('team_members[0].role', 'USER');
    });

    it('Should reject if user is already a member', async () => {
      jest
        .spyOn(prisma.userInTeam, 'create')
        .mockRejectedValueOnce({ code: 'P2002' });
      expect(
        teamsService.addTeamMember(aUser1, 'test_invite_token')
      ).rejects.toThrow(ConflictException);
    });

    it('Should reject if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValueOnce(aTeam);
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValueOnce(null);
      expect(
        teamsService.addTeamMember(aUser1, 'test_invite_token')
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('Should reject if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValueOnce(null);
      expect(
        teamsService.addTeamMember(aUser1, 'invalid_token')
      ).rejects.toThrow(NotFoundException);
    });

    it('Should reject with unknown error', async () => {
      jest
        .spyOn(prisma.userInTeam, 'create')
        .mockRejectedValueOnce({ code: 'TEST' });
      await expect(teamsService.addTeamMember(aUser1, 'test')).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('getInviteToken', () => {
    it('Should return the invite token', async () => {
      expect(teamsService.getInviteToken(1)).resolves.toStrictEqual(
        aInviteToken
      );
    });

    it('Should reject if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValueOnce(null);
      expect(teamsService.getInviteToken(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTeamAssessments', () => {
    it('Should return the team assessments', async () => {
      jest
        .spyOn(prisma.team, 'findUnique')
        .mockResolvedValueOnce(aTeamWithAssessment);
      expect(teamsService.getAssessments(1)).resolves.toStrictEqual([
        aAssessment,
      ]);
    });

    it('Should reject if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValueOnce(null);
      expect(teamsService.getAssessments(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('isUserInTeam', () => {
    it('Should return true if user is in team', async () => {
      expect(teamsService.isUserInTeam(1, 1)).resolves.toBe(true);
    });

    it('Should return false if user is not in team', async () => {
      expect(teamsService.isUserInTeam(2, 1)).resolves.toBe(false);
    });
  });

  describe('removeTeam', () => {
    it('Should remove the team', async () => {
      jest.spyOn(prisma.user, 'findMany').mockResolvedValueOnce([aUser1]);
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValueOnce(aTeam);
      expect(teamsService.removeTeamMember(1, 1)).resolves.toHaveProperty(
        'team_members[0].role',
        'USER'
      );
    });

    it('Should remove the team', async () => {
      jest.spyOn(prisma.user, 'findMany').mockResolvedValueOnce([aUser1]);
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValueOnce(aTeam);
      expect(teamsService.removeTeamMember(1, 1)).resolves.toHaveProperty(
        'team_members[0].username',
        'test_username'
      );
    });

    it('Should reject if team not found', async () => {
      jest.spyOn(prisma.userInTeam, 'delete').mockRejectedValueOnce({
        code: 'P2025',
      });
      expect(teamsService.removeTeamMember(3, 1)).rejects.toThrow(
        NotFoundException
      );
    });

    it('Should reject if team not found', async () => {
      jest.spyOn(prisma.userInTeam, 'delete').mockRejectedValueOnce({
        code: 'TEST',
      });
      expect(teamsService.removeTeamMember(1, 1)).rejects.toThrow(
        InternalServerErrorException
      );
    });

    it('Should reject if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValueOnce(null);
      expect(teamsService.removeTeamMember(1, 1)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('getTeams', () => {
    it('Should return the teams', async () => {
      expect(teamsService.getTeams(1)).resolves.toStrictEqual([aTeam]);
    });
  });
});
