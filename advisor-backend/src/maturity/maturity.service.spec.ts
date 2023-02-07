import { Test, TestingModule } from '@nestjs/testing';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MaturityService } from './maturity.service';
import { aMaturity } from '../prisma/mock/mockMaturity';
import { Role } from '@prisma/client';

const moduleMocker = new ModuleMocker(global);

describe('MaturityService', () => {
  let maturityService: MaturityService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaturityService],
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

    maturityService = module.get<MaturityService>(MaturityService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(maturityService).toBeDefined();
  });

  describe('create', () => {
    it('should return the created maturity', async () => {
      expect(maturityService.create(1)).resolves.toBe(aMaturity);
    });

    it('should throw NotFoundException on not existing template_id', async () => {
      jest
        .spyOn(prisma.maturity, 'create')
        .mockRejectedValueOnce({ code: 'P2003' });
      expect(maturityService.create(0)).rejects.toThrowError(NotFoundException);
    });

    it('should throw ConflictException on duplicate name', async () => {
      jest
        .spyOn(prisma.maturity, 'create')
        .mockRejectedValueOnce({ code: 'P2002' });
      expect(maturityService.create(1)).rejects.toThrowError(ConflictException);
    });

    it('should reject with unknown error', async () => {
      jest
        .spyOn(prisma.maturity, 'create')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(maturityService.create(1)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      expect(maturityService.findAll(1, Role.USER)).resolves.toEqual([
        aMaturity,
      ]);
    });
  });

  describe('findOne', () => {
    it('should return the found maturity', async () => {
      expect(maturityService.findOne(1)).resolves.toBe(aMaturity);
    });

    it('should throw NotFoundException on not existing maturity_id', async () => {
      jest.spyOn(prisma.maturity, 'findUnique').mockResolvedValueOnce(null);
      expect(maturityService.findOne(1)).rejects.toThrowError(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should return the updated maturity', async () => {
      const aTempMaturity = {
        ...aMaturity,
      };
      aTempMaturity.order = 9;
      jest.spyOn(prisma.maturity, 'count').mockResolvedValueOnce(10);
      expect(maturityService.update(1, aMaturity)).resolves.toBe(aMaturity);
    });

    it('should throw NotFoundException on not existing maturity_id', async () => {
      jest.spyOn(prisma.maturity, 'findUnique').mockResolvedValueOnce(null);
      expect(maturityService.update(0, aMaturity)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('should throw ConflictException on duplicate name', async () => {
      jest
        .spyOn(prisma.maturity, 'update')
        .mockRejectedValueOnce({ code: 'P2002' });
      expect(maturityService.update(1, aMaturity)).rejects.toThrowError(
        ConflictException
      );
    });

    it('should reject with unknown error', async () => {
      jest
        .spyOn(prisma.maturity, 'update')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(maturityService.update(1, aMaturity)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });

  describe('delete', () => {
    it('should return the deleted maturity', async () => {
      expect(maturityService.delete(1)).resolves.toBe(aMaturity);
    });

    it('should throw NotFoundException on not existing maturity_id', async () => {
      jest
        .spyOn(prisma.maturity, 'delete')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(maturityService.delete(0)).rejects.toThrowError(NotFoundException);
    });

    it('should reject with unknown error', async () => {
      jest
        .spyOn(prisma.maturity, 'delete')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(maturityService.delete(1)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });
});
