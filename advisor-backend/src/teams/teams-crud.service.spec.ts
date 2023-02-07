import { Test } from '@nestjs/testing';
import {
  aCreateTeam,
  aTeam,
  aUpdateTeam,
  mockCreateTeamResponse,
} from '../prisma/mock/mockTeam';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { PrismaService } from '../prisma/prisma.service';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { aUser1 } from '../prisma/mock/mockUser';
import { TeamsCRUDService } from './teams-crud.service';

const moduleMocker = new ModuleMocker(global);

describe('TeamsCRUDService', () => {
  let teamsCRUDService: TeamsCRUDService;
  let prisma: PrismaService;

  beforeEach(async () => {
    process.env = {
      DATABASE_URL: 'postgres://localhost:5432/test',
      JWT_SECRET: 'mycustomuselongsecret',
      EXPIRESIN: '60 days',
    };

    const moduleRef = await Test.createTestingModule({
      providers: [TeamsCRUDService],
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

    teamsCRUDService = moduleRef.get<TeamsCRUDService>(TeamsCRUDService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(teamsCRUDService).toBeDefined();
  });

  describe('createTeam', () => {
    it('Should return the created team', async () => {
      expect(teamsCRUDService.create(aUser1.user_id)).resolves.toBe(
        aCreateTeam
      );
    });

    it('Should reject with unkown error', async () => {
      jest.spyOn(prisma.team, 'create').mockRejectedValueOnce({ code: 'TEST' });
      await expect(
        teamsCRUDService.create(aUser1.user_id)
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('getTeam', () => {
    it('Should return the team', async () => {
      expect(teamsCRUDService.findOne(1)).resolves.toBe(aTeam);
    });

    it('Should reject if team not found', async () => {
      jest.spyOn(prisma.team, 'findUnique').mockResolvedValueOnce(null);
      expect(teamsCRUDService.findOne(2)).rejects.toThrowError(
        NotFoundException
      );
    });
  });

  describe('updateTeam', () => {
    it('Should return the team', async () => {
      jest
        .spyOn(prisma.team, 'update')
        .mockResolvedValueOnce(mockCreateTeamResponse);
      expect(teamsCRUDService.updateTeam(1, aUpdateTeam)).resolves.toBe(
        mockCreateTeamResponse
      );
    });

    it('Should reject if team not found', async () => {
      jest
        .spyOn(prisma.team, 'update')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(teamsCRUDService.updateTeam(2, aUpdateTeam)).rejects.toThrow(
        NotFoundException
      );
    });

    it('Should reject with unknown error', async () => {
      jest.spyOn(prisma.team, 'update').mockRejectedValueOnce({ code: 'TEST' });
      await expect(teamsCRUDService.updateTeam(1, aUpdateTeam)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('deleteTeam', () => {
    it('Should return the team', async () => {
      jest.spyOn(prisma.team, 'delete').mockResolvedValueOnce(aTeam);
      expect(teamsCRUDService.deleteTeam(1)).resolves.toBe(aTeam);
    });

    it('Should reject if team not found', async () => {
      jest
        .spyOn(prisma.team, 'delete')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(teamsCRUDService.deleteTeam(2)).rejects.toThrow(NotFoundException);
    });

    it('Should reject with unknown error', async () => {
      jest.spyOn(prisma.team, 'delete').mockRejectedValueOnce({ code: 'TEST' });
      await expect(teamsCRUDService.deleteTeam(1)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});
