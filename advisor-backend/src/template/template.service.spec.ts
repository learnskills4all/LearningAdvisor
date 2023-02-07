import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TemplateService } from './template.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { aTemplate } from '../prisma/mock/mockTemplate';
import { AssessmentType, Role, Template } from '@prisma/client';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

const moduleMocker = new ModuleMocker(global);

describe('TemplateService', () => {
  let templateService: TemplateService;
  let prisma: PrismaService;
  let aTempTemplate: Template & {
    [key: string]: any;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateService],
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

    templateService = module.get<TemplateService>(TemplateService);
    prisma = module.get<PrismaService>(PrismaService);
    aTempTemplate = { ...aTemplate };
  });

  it('should be defined', () => {
    expect(templateService).toBeDefined();
  });

  describe('create', () => {
    it('Should return the created template', async () => {
      expect(
        templateService.create(AssessmentType.INDIVIDUAL)
      ).resolves.toEqual(aTempTemplate);
    });

    it('Should reject if template name and type already exists', async () => {
      jest
        .spyOn(prisma.template, 'create')
        .mockRejectedValueOnce({ code: 'P2002' });
      await expect(
        templateService.create(AssessmentType.INDIVIDUAL)
      ).rejects.toThrowError(ConflictException);
    });

    it('Should reject with unknown error', async () => {
      jest
        .spyOn(prisma.template, 'create')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(
        templateService.create(AssessmentType.INDIVIDUAL)
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('Should return the found template', async () => {
      expect(templateService.findOne(1)).resolves.toEqual(aTempTemplate);
    });

    it('Should reject if template not found', async () => {
      jest.spyOn(prisma.template, 'findUnique').mockResolvedValueOnce(null);
      expect(templateService.findOne(2)).rejects.toThrowError(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('Should return the found template', async () => {
      jest
        .spyOn(prisma.template, 'update')
        .mockResolvedValueOnce(aTempTemplate);
      expect(templateService.update(1, aTempTemplate)).resolves.toHaveProperty(
        'template_id'
      );
    });

    it('Should reject if template not found', async () => {
      jest
        .spyOn(prisma.template, 'update')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(templateService.update(2, aTempTemplate)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('Should reject if template name and type are duplicate', async () => {
      jest
        .spyOn(prisma.template, 'update')
        .mockRejectedValueOnce({ code: 'P2002' });
      expect(templateService.update(1, aTempTemplate)).rejects.toThrowError(
        ConflictException
      );
    });

    it('Should reject with unknown error', async () => {
      jest
        .spyOn(prisma.template, 'update')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(templateService.update(1, aTempTemplate)).rejects.toThrowError(
        InternalServerErrorException
      );
    });

    it('Should throw error if min weight is higher than max weight', async () => {
      const tempTemp = { ...aTempTemplate };
      tempTemp.weight_range_min = 99;
      expect(templateService.update(1, tempTemp)).rejects.toThrowError(
        ConflictException
      );
    });

    it('Should throw error if max weight is lower than min weight', async () => {
      const tempTemp = { ...aTempTemplate };
      tempTemp.weight_range_max = -1;

      expect(templateService.update(1, tempTemp)).rejects.toThrowError(
        ConflictException
      );
    });
  });

  describe('findAll', () => {
    it('Should return all templates', async () => {
      expect(templateService.findAll(Role.USER)).resolves.toEqual([
        aTempTemplate,
      ]);
    });
  });

  describe('delete', () => {
    it('Should return the deleted template', async () => {
      expect(templateService.delete(1)).resolves.toEqual(aTempTemplate);
    });

    it('Should reject if template not found', async () => {
      jest.spyOn(prisma.template, 'delete').mockRejectedValueOnce({
        code: 'P2025',
      });
      expect(templateService.delete(2)).rejects.toThrowError(NotFoundException);
    });

    it('Should reject with unknown error', async () => {
      jest.spyOn(prisma.template, 'delete').mockRejectedValueOnce({
        code: 'TEST',
      });
      expect(templateService.delete(1)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });

  describe('checkWeightRange', () => {
    it('Should return true if weight is in range', async () => {
      jest
        .spyOn(templateService, 'findOne')
        .mockResolvedValueOnce(aTempTemplate);
      expect(
        templateService.checkWeightRange(aTempTemplate, 2)
      ).resolves.toEqual(true);
    });

    it('Should return false if weight is not in range', async () => {
      jest.spyOn(templateService, 'findOne').mockResolvedValueOnce(aTemplate);
      expect(
        templateService.checkWeightRange(aTempTemplate, 51)
      ).resolves.toEqual(false);
    });

    it('Should throw NotFoundException if template not found', async () => {
      jest
        .spyOn(templateService, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());
      expect(
        templateService.checkWeightRange(aTempTemplate, 2)
      ).rejects.toThrowError(NotFoundException);
    });

    it('Should return true if weight is undefined', async () => {
      expect(
        templateService.checkWeightRange(aTempTemplate, undefined)
      ).resolves.toEqual(true);
    });
  });
});
