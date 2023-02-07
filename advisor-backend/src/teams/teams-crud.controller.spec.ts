import { Test } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { aTeam, aUpdateTeam } from '../prisma/mock/mockTeam';
import { TeamsCRUDService } from './teams-crud.service';
import { TeamsCRUDController } from './teams-crud.controller';
import { aAdmin, aUser1 } from '../prisma/mock/mockUser';
import { TeamsService } from './teams.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { mockPrisma } from '../prisma/mock/mockPrisma';

const moduleMocker = new ModuleMocker(global);

describe('TeamsCRUDController', () => {
  let teamsCRUDController: TeamsCRUDController;
  let teamsService: TeamsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    process.env = {
      DATABASE_URL: 'postgres://localhost:5432/test',
      JWT_SECRET: 'mycustomuselongsecret',
      EXPIRESIN: '60 days',
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [TeamsCRUDController],
      providers: [TeamsService],
    })
      .useMocker((token) => {
        if (token === TeamsCRUDService) {
          return {
            create: jest.fn().mockResolvedValue(aTeam),
            findOne: jest.fn().mockResolvedValue(aTeam),
            findUnique: jest.fn().mockResolvedValue(aTeam),
            deleteTeam: jest.fn().mockResolvedValue(aTeam),
            updateTeam: jest.fn().mockResolvedValue(aTeam),
          };
        }
        if (token === TeamsService) {
          return {
            isUserInTeam: jest.fn().mockReturnValue(
              new Promise(() => {
                return true;
              })
            ),
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

    teamsCRUDController =
      moduleRef.get<TeamsCRUDController>(TeamsCRUDController);
    teamsService = moduleRef.get<TeamsService>(TeamsService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(teamsCRUDController).toBeDefined();
  });

  describe('createTeam', () => {
    it('Should return the created team', async () => {
      expect(teamsCRUDController.create(aAdmin)).resolves.toBe(aTeam);
    });
  });

  describe('getTeam', () => {
    it('Should return the team', async () => {
      expect(teamsCRUDController.findOne(aAdmin, 1)).resolves.toBe(aTeam);
    });

    it('Should throw error if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockReturnValueOnce(null);
      expect(teamsCRUDController.findOne(aAdmin, 1)).rejects.toThrow(
        NotFoundException
      );
    });

    it('Should throw error if team not found', async () => {
      jest
        .spyOn(prisma.team, 'findUnique')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(teamsCRUDController.findOne(aAdmin, 1)).rejects.toThrowError(
        InternalServerErrorException
      );
    });

    it('Should throw error if user not part of the team', async () => {
      jest.spyOn(teamsService, 'isUserInTeam').mockResolvedValueOnce(false);
      expect(teamsCRUDController.findOne(aUser1, 1)).rejects.toThrow(
        ForbiddenException
      );
    });

    it('Should return the team', async () => {
      jest.spyOn(teamsService, 'isUserInTeam').mockResolvedValueOnce(false);
      expect(teamsCRUDController.findOne(aAdmin, 1)).resolves.toBe(aTeam);
    });
  });

  describe('updateTeam', () => {
    it('Should return the updateTeamDto', async () => {
      expect(
        teamsCRUDController.updateTeam(aAdmin, 1, aUpdateTeam)
      ).resolves.toBe(aTeam);
    });

    it('Should throw error if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockReturnValueOnce(null);
      expect(
        teamsCRUDController.updateTeam(aAdmin, 1, aUpdateTeam)
      ).rejects.toThrow(NotFoundException);
    });

    it('Should throw error if team not found', async () => {
      jest
        .spyOn(prisma.team, 'findUnique')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(
        teamsCRUDController.updateTeam(aAdmin, 1, aUpdateTeam)
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('Should throw error if user not part of the team', async () => {
      jest.spyOn(teamsService, 'isUserInTeam').mockResolvedValueOnce(false);
      expect(
        teamsCRUDController.updateTeam(aUser1, 1, aUpdateTeam)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteTeam', () => {
    it('Should return the team', async () => {
      expect(teamsCRUDController.deleteTeam(aAdmin, 1)).resolves.toBe(aTeam);
    });

    it('Should throw error if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockReturnValueOnce(null);
      expect(teamsCRUDController.deleteTeam(aAdmin, 1)).rejects.toThrow(
        NotFoundException
      );
    });

    it('Should throw error if team not found', async () => {
      jest
        .spyOn(teamsService, 'isUserInTeam')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(teamsCRUDController.deleteTeam(aAdmin, 1)).rejects.toThrow(
        InternalServerErrorException
      );
    });

    it('Should throw error if user not part of the team', async () => {
      jest.spyOn(teamsService, 'isUserInTeam').mockResolvedValueOnce(false);
      expect(teamsCRUDController.deleteTeam(aUser1, 1)).rejects.toThrow(
        ForbiddenException
      );
    });
  });
});
