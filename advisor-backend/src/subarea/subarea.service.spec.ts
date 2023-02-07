import { Test, TestingModule } from '@nestjs/testing';
import { SubareaService } from './subarea.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { PrismaService } from '../prisma/prisma.service';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { aSubarea } from '../prisma/mock/mockSubarea';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';

const moduleMocker = new ModuleMocker(global);

describe('SubareaService', () => {
  let subareaService: SubareaService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubareaService],
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

    subareaService = module.get<SubareaService>(SubareaService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(subareaService).toBeDefined();
  });

  describe('create', () => {
    it('should return the created subarea', async () => {
      expect(subareaService.create(1)).resolves.toBe(aSubarea);
    });

    it('should throw an error if subarea with this name already exists', async () => {
      jest.spyOn(prisma.subArea, 'create').mockRejectedValue({ code: 'P2002' });
      await expect(subareaService.create(1)).rejects.toThrowError(
        ConflictException
      );
    });

    it('Should throw an error if category is not found', async () => {
      jest.spyOn(prisma.subArea, 'create').mockRejectedValue({ code: 'P2003' });
      await expect(subareaService.create(1)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('Should throw an unknown error if prisma throws an unknown error', async () => {
      jest.spyOn(prisma.subArea, 'create').mockRejectedValue({ code: 'TEST' });
      await expect(subareaService.create(1)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });

  describe('findAll', () => {
    it('should return all subareas', async () => {
      expect(subareaService.findAll(1, Role.USER)).resolves.toEqual([aSubarea]);
    });
  });

  describe('findOne', () => {
    it('should return the subarea', async () => {
      expect(subareaService.findOne(1)).resolves.toBe(aSubarea);
    });

    it('should throw an error if subarea is not found', async () => {
      jest.spyOn(prisma.subArea, 'findUnique').mockResolvedValueOnce(null);
      await expect(subareaService.findOne(1)).rejects.toThrowError(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should return the updated subarea', async () => {
      expect(subareaService.update(1, aSubarea)).resolves.toBe(aSubarea);
    });

    it('should throw an error if subarea name is not unique', async () => {
      jest.spyOn(prisma.subArea, 'update').mockRejectedValue({ code: 'P2002' });
      await expect(subareaService.update(1, aSubarea)).rejects.toThrowError(
        ConflictException
      );
    });

    it('should throw an error if category not found', async () => {
      jest.spyOn(prisma.subArea, 'findUnique').mockResolvedValueOnce(null);
      await expect(subareaService.update(1, aSubarea)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('Should throw an unknown error if prisma throws an unknown error', async () => {
      jest.spyOn(prisma.subArea, 'update').mockRejectedValue({ code: 'TEST' });
      await expect(subareaService.update(1, aSubarea)).rejects.toThrowError(
        InternalServerErrorException
      );
    });

    it('Should throw BadRequestException if order is too high', async () => {
      jest.spyOn(prisma.subArea, 'count').mockResolvedValueOnce(-1);
      expect(subareaService.update(1, aSubarea)).rejects.toThrowError(
        ConflictException
      );
    });
  });

  describe('delete', () => {
    it('should return the deleted subarea', async () => {
      expect(subareaService.delete(1)).resolves.toBe(aSubarea);
    });

    it('should throw an error if subarea is not found', async () => {
      jest
        .spyOn(prisma.subArea, 'delete')
        .mockRejectedValueOnce({ code: 'P2025' });
      await expect(subareaService.delete(1)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('Should throw an unknown error if prisma throws an unknown error', async () => {
      jest.spyOn(prisma.subArea, 'delete').mockRejectedValue({ code: 'TEST' });
      await expect(subareaService.delete(1)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });
});
