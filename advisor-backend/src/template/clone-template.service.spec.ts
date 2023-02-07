import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { aTemplate } from '../prisma/mock/mockTemplate';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CloneTemplateService } from './clone-template.service';
import { aCategory } from '../prisma/mock/mockCategory';
import { aCheckpoint } from '../prisma/mock/mockCheckpoint';

const moduleMocker = new ModuleMocker(global);

describe('CloneTemplateService', () => {
  let cloneTemplateService: CloneTemplateService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloneTemplateService],
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

    cloneTemplateService =
      module.get<CloneTemplateService>(CloneTemplateService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(cloneTemplateService).toBeDefined();
  });

  describe('createMap', () => {
    it('Should return the created map', () => {
      const newCat = { ...aCategory };
      newCat.category_id = 2;
      newCat.category_name = 'TEST2';
      const input = [aCategory, newCat];
      const output = {};
      output[aCategory.category_id] = aCategory.category_id;
      output[newCat.category_id] = newCat.category_id;
      expect(cloneTemplateService.createMap(input, input, 'category')).toEqual(
        output
      );
    });
  });

  describe('cloneTemplate', () => {
    it('Should return the created template', async () => {
      expect(cloneTemplateService.cloneTemplate(aTemplate)).resolves.toBe(
        aTemplate
      );
    });

    it('Should throw an InternalServerException if Prisma throws an error', async () => {
      jest
        .spyOn(prisma.template, 'create')
        .mockRejectedValueOnce({ code: 'TEST' });
      await expect(cloneTemplateService.cloneTemplate(aTemplate)).resolves.toBe(
        null
      );
    });
  });

  describe('linkTopics', () => {
    it('Should create the topics', async () => {
      expect(
        cloneTemplateService.linkTopics(
          aTemplate,
          aTemplate,
          [1],
          [aCheckpoint]
        )
      ).resolves;
    });
  });

  describe('clone', () => {
    it('Should return the created template', async () => {
      expect(cloneTemplateService.clone(1)).resolves.toBe(aTemplate);
    });

    it('Should return NotFoundException if template not found', async () => {
      jest.spyOn(prisma.template, 'findUnique').mockResolvedValueOnce(null);
      await expect(cloneTemplateService.clone(1)).rejects.toThrow(
        NotFoundException
      );
    });

    it('Should throw InternalServerException if cloneTemplate fails', async () => {
      jest
        .spyOn(cloneTemplateService, 'cloneTemplate')
        .mockResolvedValueOnce(null);
      expect(cloneTemplateService.clone(1)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });
});
