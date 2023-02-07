import { Test, TestingModule } from '@nestjs/testing';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { PrismaService } from '../prisma/prisma.service';
import { aCategory } from '../prisma/mock/mockCategory';
import { CategoryService } from './category.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';

const moduleMocker = new ModuleMocker(global);

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService],
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

    categoryService = module.get<CategoryService>(CategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(categoryService).toBeDefined();
  });

  describe('create', () => {
    it('should return the created category', async () => {
      expect(categoryService.create(1)).resolves.toBe(aCategory);
    });

    it('should throw NotFoundException on not existing template_id', async () => {
      jest
        .spyOn(prisma.category, 'create')
        .mockRejectedValueOnce({ code: 'P2003' });
      expect(categoryService.create(0)).rejects.toThrowError(NotFoundException);
    });

    it('should throw ConflictException on duplicate name', async () => {
      jest
        .spyOn(prisma.category, 'create')
        .mockRejectedValueOnce({ code: 'P2002' });
      expect(categoryService.create(1)).rejects.toThrowError(ConflictException);
    });

    it('should reject with unknown error', async () => {
      jest
        .spyOn(prisma.category, 'create')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(categoryService.create(1)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      expect(categoryService.findAll(1, Role.ADMIN)).resolves.toEqual([
        aCategory,
      ]);
    });
  });

  describe('findOne', () => {
    it('should return the found category', async () => {
      expect(categoryService.findOne(1)).resolves.toBe(aCategory);
    });

    it('should throw NotFoundException on not existing category_id', async () => {
      jest.spyOn(prisma.category, 'findUnique').mockResolvedValueOnce(null);
      expect(categoryService.findOne(1)).rejects.toThrowError(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should return the updated category', async () => {
      expect(categoryService.update(1, aCategory)).resolves.toBe(aCategory);
    });

    it('should throw NotFoundException on not existing category_id', async () => {
      jest.spyOn(prisma.category, 'findUnique').mockResolvedValueOnce(null);
      expect(categoryService.update(0, aCategory)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('should throw ConflictException on duplicate name', async () => {
      jest
        .spyOn(prisma.category, 'update')
        .mockRejectedValueOnce({ code: 'P2002' });
      expect(categoryService.update(1, aCategory)).rejects.toThrowError(
        ConflictException
      );
    });

    it('should reject with unknown error', async () => {
      jest
        .spyOn(prisma.category, 'update')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(categoryService.update(1, aCategory)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });

  describe('delete', () => {
    it('should return the deleted category', async () => {
      expect(categoryService.delete(1)).resolves.toBe(aCategory);
    });

    it('should throw NotFoundException on not existing category_id', async () => {
      jest
        .spyOn(prisma.category, 'delete')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(categoryService.delete(0)).rejects.toThrowError(NotFoundException);
    });

    it('should reject with unknown error', async () => {
      jest
        .spyOn(prisma.category, 'delete')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(categoryService.delete(1)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });
});
