import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { aAssessment } from '../prisma/mock/mockAssessment';
import { aCategory } from '../prisma/mock/mockCategory';
import { aCheckpoint } from '../prisma/mock/mockCheckpoint';
import { aCheckpointAndAnswerInAssessment } from '../prisma/mock/mockCheckpointAndAnswersInAssessments';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { aTemplate } from '../prisma/mock/mockTemplate';
import { PrismaService } from '../prisma/prisma.service';
import { SaveService } from './save.service';

const moduleMocker = new ModuleMocker(global);

describe('SaveService', () => {
  let saveService: SaveService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaveService],
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

    saveService = module.get<SaveService>(SaveService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(saveService).toBeDefined();
  });

  describe('saveCheckpoint', () => {
    it('Should save the checkpoint', async () => {
      const tempAns = {
        ...aCheckpointAndAnswerInAssessment,
      };
      tempAns.answer_id = undefined;
      expect(
        saveService.saveCheckpoint(aAssessment, tempAns)
      ).resolves.toHaveProperty('msg');
    });

    it('Should throw BadRequestException if template doesnt allow n/a and answer id is undefined', async () => {
      const temp = { ...aCheckpointAndAnswerInAssessment };
      const tempTemp = { ...aTemplate };
      tempTemp.include_no_answer = false;
      temp.answer_id = undefined;
      jest.spyOn(prisma.template, 'findUnique').mockResolvedValueOnce(tempTemp);
      expect(
        saveService.saveCheckpoint(aAssessment, temp)
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('getSavedCheckpoints', () => {
    it('Should return the saved checkpoints', async () => {
      jest.spyOn(prisma.maturity, 'findMany').mockResolvedValueOnce([]);
      const tempCat = {
        ...aCategory,
        Checkpoint: [aCheckpoint],
      };
      jest.spyOn(prisma.category, 'findMany').mockResolvedValueOnce([tempCat]);
      expect(
        saveService.getSavedCheckpoints(aAssessment)
      ).resolves.toBeInstanceOf(Array);
    });
  });

  describe('areAllAnswersFilled', () => {
    it('Should return false if amount of saved answers is not the same as amount of checkpoints in categories', async () => {
      jest
        .spyOn(saveService, 'getSavedCheckpoints')
        .mockResolvedValueOnce([aCheckpointAndAnswerInAssessment]);
      const tempCat = {
        ...aCategory,
        Checkpoint: [],
      };
      jest.spyOn(prisma.category, 'findMany').mockResolvedValueOnce([tempCat]);
      expect(saveService.areAllAnswersFilled(aAssessment)).resolves.toBe(false);
    });

    it('Should return true if amount of saved answers is the same as amount of checkpoints in categories', async () => {
      jest
        .spyOn(saveService, 'getSavedCheckpoints')
        .mockResolvedValueOnce([aCheckpointAndAnswerInAssessment]);
      const tempCat = {
        ...aCategory,
        Checkpoint: [aCheckpoint],
      };
      jest.spyOn(prisma.category, 'findMany').mockResolvedValueOnce([tempCat]);
      expect(saveService.areAllAnswersFilled(aAssessment)).resolves.toBe(true);
    });
  });
});
