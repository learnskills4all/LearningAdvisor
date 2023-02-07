import { Test } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { aTeam } from '../prisma/mock/mockTeam';
import { aTeamMembers } from '../prisma/mock/mockTeamMembers';
import { aAssessment, aAssessmentFull } from '../prisma/mock/mockAssessment';
import { InviteTokenDto } from './dto/invite-token.dto';
import { aUser1 } from '../prisma/mock/mockUser';
import { PrismaService } from '../prisma/prisma.service';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

const moduleMocker = new ModuleMocker(global);

describe('TeamsController', () => {
  let teamController: TeamsController;
  let teamsService: TeamsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    process.env = {
      DATABASE_URL: 'postgres://localhost:5432/test',
      JWT_SECRET: 'mycustomuselongsecret',
      EXPIRESIN: '60 days',
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [TeamsService],
    })
      .useMocker((token) => {
        if (token === TeamsService) {
          return {
            findUnique: jest.fn().mockResolvedValue(aTeam),
            findTeamMembers: jest.fn().mockResolvedValue(aTeamMembers),
            addTeamMember: jest.fn().mockResolvedValue(aTeamMembers),
            getAssessments: jest.fn().mockResolvedValue([aAssessment]),
            getTeams: jest.fn().mockResolvedValue([aTeam]),
            getInviteToken: jest.fn().mockResolvedValue({
              invite_token: 'test_invite_token',
            } as InviteTokenDto),
            deleteTeam: jest.fn().mockResolvedValue(aTeam),
            isUserInTeam: jest.fn().mockResolvedValue(true),
            removeTeamMember: jest.fn().mockResolvedValue(aTeamMembers),
          };
        }
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

    teamController = moduleRef.get<TeamsController>(TeamsController);
    teamsService = moduleRef.get<TeamsService>(TeamsService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(teamController).toBeDefined();
  });

  describe('Get the user teams', () => {
    it('should return the user teams', async () => {
      jest.spyOn(teamsService, 'getTeams').mockResolvedValueOnce([aTeam]);
      expect(teamController.getTeams(aUser1)).resolves.toStrictEqual([aTeam]);
    });
  });

  describe('getTeamMembers', () => {
    it('Should return the team members', async () => {
      jest
        .spyOn(teamsService, 'findTeamMembers')
        .mockResolvedValueOnce(aTeamMembers);
      expect(teamController.findTeamMembers(aUser1, 1)).resolves.toBe(
        aTeamMembers
      );
    });

    it('Should throw error if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockReturnValueOnce(null);
      expect(teamController.findTeamMembers(aUser1, 1)).rejects.toThrow(
        NotFoundException
      );
    });

    it('Should throw error if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockReturnValueOnce(null);
      expect(teamController.findTeamMembers(aUser1, 1)).rejects.toThrow(
        NotFoundException
      );
    });

    it('Should throw error if team not found', async () => {
      jest
        .spyOn(teamsService, 'isUserInTeam')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(teamController.findTeamMembers(aUser1, 1)).rejects.toThrow(
        InternalServerErrorException
      );
    });

    it('Should throw error if team not found', async () => {
      jest.spyOn(teamsService, 'isUserInTeam').mockResolvedValueOnce(false);
      expect(teamController.findTeamMembers(aUser1, 1)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('addTeamMember', () => {
    it('Should return the team members', async () => {
      jest
        .spyOn(teamsService, 'addTeamMember')
        .mockResolvedValueOnce(aTeamMembers);
      expect(teamController.addTeamMember(aUser1, 'test')).resolves.toBe(
        aTeamMembers
      );
    });
  });

  describe('getInviteToken', () => {
    it('Should return the invite token', async () => {
      expect(teamController.getInviteToken(aUser1, 1)).resolves.toStrictEqual({
        invite_token: 'test_invite_token',
      } as InviteTokenDto);
    });

    it('Should throw error if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockReturnValueOnce(null);
      expect(teamController.getInviteToken(aUser1, 1)).rejects.toThrow(
        NotFoundException
      );
    });

    it('Should throw error if team not found', async () => {
      jest
        .spyOn(teamsService, 'isUserInTeam')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(teamController.getInviteToken(aUser1, 1)).rejects.toThrow(
        InternalServerErrorException
      );
    });

    it('Should throw error if team not found', async () => {
      jest.spyOn(teamsService, 'isUserInTeam').mockResolvedValueOnce(false);
      expect(teamController.getInviteToken(aUser1, 1)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('getAssessments', () => {
    it('Should return the assessments', async () => {
      jest
        .spyOn(teamsService, 'getAssessments')
        .mockResolvedValueOnce([aAssessmentFull]);
      expect(teamController.getTeamAssessments(aUser1, 1)).resolves.toEqual([
        aAssessmentFull,
      ]);
    });

    it('Should throw error if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockReturnValueOnce(null);
      expect(teamController.getTeamAssessments(aUser1, 1)).rejects.toThrow(
        NotFoundException
      );
    });

    it('Should throw error if team not found', async () => {
      jest
        .spyOn(teamsService, 'isUserInTeam')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(teamController.getTeamAssessments(aUser1, 1)).rejects.toThrow(
        InternalServerErrorException
      );
    });

    it('Should throw error if team not found', async () => {
      jest.spyOn(teamsService, 'isUserInTeam').mockResolvedValueOnce(false);
      expect(teamController.getTeamAssessments(aUser1, 1)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('deleteTeamMember', () => {
    it('Should return the team members', async () => {
      jest
        .spyOn(teamsService, 'removeTeamMember')
        .mockResolvedValueOnce(aTeamMembers);
      expect(teamController.deleteTeamMember(aUser1, 1, 1)).resolves.toBe(
        aTeamMembers
      );
    });

    it('Should throw error if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockReturnValueOnce(null);
      expect(teamController.deleteTeamMember(aUser1, 1, 1)).rejects.toThrow(
        NotFoundException
      );
    });

    it('Should throw error if team not found', async () => {
      jest
        .spyOn(teamsService, 'isUserInTeam')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(teamController.deleteTeamMember(aUser1, 1, 1)).rejects.toThrow(
        InternalServerErrorException
      );
    });

    it('Should throw error if user has role user and tries to remove other merror', async () => {
      expect(teamController.deleteTeamMember(aUser1, 1, 2)).rejects.toThrow(
        ForbiddenException
      );
    });

    it('Should throw error if team not found', async () => {
      jest.spyOn(teamsService, 'isUserInTeam').mockResolvedValueOnce(false);
      expect(teamController.deleteTeamMember(aUser1, 1, 1)).rejects.toThrow(
        ForbiddenException
      );
    });
  });
});
