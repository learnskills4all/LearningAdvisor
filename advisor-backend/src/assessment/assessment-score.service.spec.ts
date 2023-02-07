import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { Test, TestingModule } from '@nestjs/testing';
import {
  aAssessment,
  aTeamAssessment,
  aTeamAssessmentFull,
  aTeamAssessmentFullIncomplete,
} from '../prisma/mock/mockAssessment';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { PrismaService } from '../prisma/prisma.service';
import { AssessmentService } from './assessment.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AssessmentScoreService } from './assessment-score.service';
import { aCheckpointFull } from '../prisma/mock/mockCheckpoint';
import {
  aScore,
  categoryIdsList,
  categoryIdsList1,
  checkpoints,
  checkpoints1,
  checkpoints2,
  maturityIdsList,
  maturityIdsList1,
  output,
  output1,
  possibleAnswers,
  possibleAnswers1,
} from '../prisma/mock/mockScore';

const moduleMocker = new ModuleMocker(global);

describe('AssessmentScoreService', () => {
  let prisma: PrismaService;
  let assessmentScoreService: AssessmentScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssessmentService, AssessmentScoreService],
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

    prisma = module.get<PrismaService>(PrismaService);
    assessmentScoreService = module.get<AssessmentScoreService>(
      AssessmentScoreService
    );
  });

  it('should be defined', () => {
    expect(assessmentScoreService).toBeDefined();
  });

  describe('getScore', () => {
    it('Should return the score', async () => {
      jest
        .spyOn(prisma.assessment, 'findUnique')
        .mockResolvedValueOnce(aTeamAssessmentFull);
      jest
        .spyOn(assessmentScoreService, 'calculateScores')
        .mockResolvedValueOnce([aScore]);
      expect(
        assessmentScoreService.getScore(aTeamAssessment.assessment_id, null)
      ).resolves.toStrictEqual([aScore]);
    });

    it('Should throw error if assessment not found', async () => {
      jest.spyOn(prisma.assessment, 'findUnique').mockResolvedValueOnce(null);
      expect(
        assessmentScoreService.getScore(aTeamAssessment.assessment_id, null)
      ).rejects.toThrow(NotFoundException);
    });

    it('Should throw error if assessment is not a team assessment', async () => {
      expect(
        assessmentScoreService.getScore(aAssessment.assessment_id, null)
      ).rejects.toThrow(ForbiddenException);
    });

    it('Should throw error if assessment is not complete', async () => {
      jest
        .spyOn(prisma.assessment, 'findUnique')
        .mockResolvedValueOnce(aTeamAssessmentFullIncomplete);
      expect(
        assessmentScoreService.getScore(
          aTeamAssessmentFullIncomplete.assessment_id,
          null
        )
      ).rejects.toThrow(BadRequestException);
    });

    it('Should throw error if there are no enabled maturities associated to the template', async () => {
      jest
        .spyOn(prisma.assessment, 'findUnique')
        .mockResolvedValueOnce(aTeamAssessmentFull);
      jest.spyOn(prisma.maturity, 'findMany').mockResolvedValueOnce([]);
      expect(
        assessmentScoreService.getScore(aTeamAssessmentFull.assessment_id, null)
      ).rejects.toThrow(BadRequestException);
    });

    it('Should throw error if no enabled categories found associated to this template', async () => {
      jest
        .spyOn(prisma.assessment, 'findUnique')
        .mockResolvedValueOnce(aTeamAssessmentFull);
      jest.spyOn(prisma.category, 'findMany').mockResolvedValueOnce([]);
      expect(
        assessmentScoreService.getScore(aTeamAssessmentFull.assessment_id, null)
      ).rejects.toThrow(BadRequestException);
    });

    it('Should return the score for a topic', async () => {
      jest
        .spyOn(prisma.assessment, 'findUnique')
        .mockResolvedValueOnce(aTeamAssessmentFull);
      jest
        .spyOn(prisma.checkpoint, 'findMany')
        .mockResolvedValueOnce([aCheckpointFull]);
      jest
        .spyOn(assessmentScoreService, 'calculateScores')
        .mockResolvedValueOnce([aScore]);
      expect(
        assessmentScoreService.getScore(aTeamAssessment.assessment_id, 1)
      ).resolves.toStrictEqual([aScore]);
    });

    it('Should throw error if topic not found or not enabled for this template', async () => {
      jest
        .spyOn(prisma.assessment, 'findUnique')
        .mockResolvedValueOnce(aTeamAssessmentFull);
      jest.spyOn(prisma.topic, 'findFirst').mockResolvedValueOnce(null);
      expect(
        assessmentScoreService.getScore(aTeamAssessmentFull.assessment_id, 1)
      ).rejects.toThrow(BadRequestException);
    });

    it('Should throw error if no enabled possible answers found associated to this template', async () => {
      jest
        .spyOn(prisma.assessment, 'findUnique')
        .mockResolvedValueOnce(aTeamAssessmentFull);
      jest.spyOn(prisma.answer, 'findMany').mockResolvedValueOnce([]);
      expect(
        assessmentScoreService.getScore(aTeamAssessment.assessment_id, null)
      ).rejects.toThrow(BadRequestException);
    });

    it('Should throw error if no enabled checkpoints found associated to this template', async () => {
      jest
        .spyOn(prisma.assessment, 'findUnique')
        .mockResolvedValueOnce(aTeamAssessmentFull);
      jest.spyOn(prisma.checkpoint, 'findMany').mockResolvedValueOnce([]);
      expect(
        assessmentScoreService.getScore(aTeamAssessmentFull.assessment_id, null)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('calculateScores', () => {
    it('Should return the score', async () => {
      expect(
        assessmentScoreService.calculateScores(
          possibleAnswers,
          maturityIdsList,
          categoryIdsList,
          checkpoints,
          null
        )
      ).toStrictEqual(output);
    });
  });

  describe('calculateScores', () => {
    it('Should return the score', async () => {
      expect(
        assessmentScoreService.calculateScores(
          possibleAnswers1,
          maturityIdsList1,
          categoryIdsList1,
          checkpoints1,
          null
        )
      ).toStrictEqual(output1);
    });
  });

  describe('calculateScores', () => {
    it('Should return the score', async () => {
      expect(
        assessmentScoreService.calculateScores(
          possibleAnswers1,
          maturityIdsList1,
          categoryIdsList1,
          checkpoints2,
          null
        )
      ).toStrictEqual(output1);
    });
  });

  describe('calculateScores', () => {
    it('Should return the score', async () => {
      expect(
        assessmentScoreService.calculateScores(
          possibleAnswers1,
          maturityIdsList1,
          categoryIdsList1,
          checkpoints2,
          1
        )
      ).toStrictEqual(output1);
    });
  });
});
