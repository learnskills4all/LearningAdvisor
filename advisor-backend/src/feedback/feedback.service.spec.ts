import { Test, TestingModule } from '@nestjs/testing';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { PrismaService } from '../prisma/prisma.service';
import { FeedbackService, ISort } from './feedback.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { aFeedback } from '../prisma/mock/mockFeedback';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { aAssessment } from '../prisma/mock/mockAssessment';
import { CheckpointAndAnswersInAssessments, Feedback } from '@prisma/client';
import { SaveService } from '../save/save.service';
import { RecommendationDto } from './dto/recommendation.dto';

const moduleMocker = new ModuleMocker(global);

const a: RecommendationDto = {
  feedback_additional_information: '',
  feedback_text: '',
  topic_ids: [],
};

const b = {
  ...a,
};

const iSort1: ISort = {
  answerWeight: 1,
  categoryOrder: 1,
  checkpointWeight: 1,
  data: {
    feedback_additional_information: '',
    feedback_text: '',
    topic_ids: [],
  },
  maturityOrder: 1,
};

const iSort2: ISort = {
  ...iSort1,
};

describe('FeedbackService', () => {
  let feedbackService: FeedbackService;
  let prisma: PrismaService;
  let aTempFeedback: Feedback;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedbackService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return mockPrisma;
        }
        if (token === SaveService) {
          return {
            getSavedCheckpoints: jest.fn().mockResolvedValue([
              {
                assessment_id: 1,
                checkpoint_id: 1,
                answer_id: 1,
              } as CheckpointAndAnswersInAssessments,
            ]),
          };
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

    feedbackService = module.get<FeedbackService>(FeedbackService);
    prisma = module.get<PrismaService>(PrismaService);

    aTempFeedback = {
      ...aFeedback,
    };
  });

  it('should be defined', () => {
    expect(feedbackService).toBeDefined();
  });

  describe('updateRecommendation', () => {
    it('should return the updated feedback', async () => {
      jest.spyOn(prisma.feedback, 'count').mockResolvedValueOnce(10);
      aTempFeedback.order = 6;
      expect(
        feedbackService.updateRecommendation(1, aTempFeedback)
      ).resolves.toBe(aFeedback);
    });

    it('should throw an error if the feedback does not exist', async () => {
      jest.spyOn(prisma.feedback, 'findUnique').mockResolvedValueOnce(null);
      expect(
        feedbackService.updateRecommendation(1, aTempFeedback)
      ).rejects.toThrowError(NotFoundException);
    });

    it('Should throw error with invalid order', async () => {
      jest.spyOn(prisma.feedback, 'count').mockResolvedValueOnce(-1);
      expect(
        feedbackService.updateRecommendation(0, aTempFeedback)
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('getRecommendations', () => {
    it('should return the recommendations', async () => {
      aAssessment.completed_at = new Date();
      jest
        .spyOn(prisma.feedback, 'findMany')
        .mockResolvedValue([aTempFeedback]);
      expect(feedbackService.getRecommendations(aAssessment)).resolves.toEqual([
        aTempFeedback,
      ]);
    });

    it('Should return the calculated recommendations if not complete', async () => {
      aAssessment.completed_at = null;
      jest
        .spyOn(feedbackService, 'calculateRecommendations')
        .mockResolvedValue([aTempFeedback]);
      expect(
        feedbackService.getRecommendations(aAssessment)
      ).resolves.toHaveLength(1);
    });

    it('Should filter on topic_id', async () => {
      aAssessment.completed_at = new Date();
      expect(
        feedbackService.getRecommendations(aAssessment, 99)
      ).resolves.toHaveLength(1);
    });
  });

  describe('saveRecommendations', () => {
    it('should return the recommendations', async () => {
      jest
        .spyOn(feedbackService, 'calculateRecommendations')
        .mockResolvedValue([aTempFeedback]);
      expect(feedbackService.saveRecommendations(aAssessment)).resolves;
    });
  });

  describe('calculateRecommendations', () => {
    it('should return the recommendations', async () => {
      expect(
        feedbackService.calculateRecommendations(aAssessment)
      ).resolves.toHaveLength(1);
    });
  });

  describe('compareTopic', () => {
    it('Should return a function', () => {
      expect(feedbackService.compareTopic(1)).toBeInstanceOf(Function);
    });

    it('The function iside should return 0 if topic id is in both arrays', () => {
      a.topic_ids = [1];
      b.topic_ids = [1];
      expect(feedbackService.compareTopic(1)(a, b)).toBe(0);
    });

    it('The function iside should return -1 if topic id is in a but not in b', () => {
      a.topic_ids = [1];
      b.topic_ids = [2];
      expect(feedbackService.compareTopic(1)(a, b)).toBe(-1);
    });

    it('The function iside should return 1 if topic id is in b but not in a', () => {
      a.topic_ids = [2];
      b.topic_ids = [1];
      expect(feedbackService.compareTopic(1)(a, b)).toBe(1);
    });

    it('Should return 0 if neither array has topic id', () => {
      a.topic_ids = [2];
      b.topic_ids = [2];
      expect(feedbackService.compareTopic(1)(a, b)).toBe(0);
    });
  });

  describe('compareMaturity', () => {
    it('Should call compareAnswerWeight if maturityOrder is the same', () => {
      iSort1.maturityOrder = 1;
      iSort2.maturityOrder = 1;
      jest.spyOn(feedbackService, 'compareAnswerWeight');
      feedbackService.compareMaturity(iSort1, iSort2);
      expect(feedbackService.compareAnswerWeight).toHaveBeenCalled();
    });

    it('Should return a negative value if b.maturityOrder is greater than a.maturityOrder', () => {
      iSort1.maturityOrder = 1;
      iSort2.maturityOrder = 2;
      expect(feedbackService.compareMaturity(iSort1, iSort2)).toBeLessThan(0);
    });

    it('Should return a positive value if a.maturityOrder is greater than b.maturityOrder', () => {
      iSort1.maturityOrder = 2;
      iSort2.maturityOrder = 1;
      expect(feedbackService.compareMaturity(iSort1, iSort2)).toBeGreaterThan(
        0
      );
    });
  });

  describe('compareAnswerWeight', () => {
    it('Should call compareCategoryOrder if answerWeight is the same', () => {
      iSort1.answerWeight = 1;
      iSort2.answerWeight = 1;
      jest.spyOn(feedbackService, 'compareCategoryOrder');
      feedbackService.compareAnswerWeight(iSort1, iSort2);
      expect(feedbackService.compareCategoryOrder).toHaveBeenCalled();
    });

    it('Should return a negative value if b.answerWeight is greater than a.answerWeight', () => {
      iSort1.answerWeight = 1;
      iSort2.answerWeight = 2;
      expect(feedbackService.compareAnswerWeight(iSort1, iSort2)).toBeLessThan(
        0
      );
    });

    it('Should return a positive value if a.answerWeight is greater than b.answerWeight', () => {
      iSort1.answerWeight = 2;
      iSort2.answerWeight = 1;
      expect(
        feedbackService.compareAnswerWeight(iSort1, iSort2)
      ).toBeGreaterThan(0);
    });
  });

  describe('compareCategoryOrder', () => {
    it('Should call compareWeight if categoryOrder is the same', () => {
      iSort1.categoryOrder = 1;
      iSort2.categoryOrder = 1;
      jest.spyOn(feedbackService, 'compareWeight');
      feedbackService.compareCategoryOrder(iSort1, iSort2);
      expect(feedbackService.compareWeight).toHaveBeenCalled();
    });

    it('Should return a negative value if b.categoryOrder is greater than a.categoryOrder', () => {
      iSort1.categoryOrder = 1;
      iSort2.categoryOrder = 2;
      expect(feedbackService.compareCategoryOrder(iSort1, iSort2)).toBeLessThan(
        0
      );
    });

    it('Should return a positive value if a.categoryOrder is greater than b.categoryOrder', () => {
      iSort1.categoryOrder = 2;
      iSort2.categoryOrder = 1;
      expect(
        feedbackService.compareCategoryOrder(iSort1, iSort2)
      ).toBeGreaterThan(0);
    });
  });

  describe('compareWeight', () => {
    it('Should return 0 if weight is the same', () => {
      iSort1.checkpointWeight = 1;
      iSort2.checkpointWeight = 1;
      expect(feedbackService.compareWeight(iSort1, iSort2)).toBe(0);
    });

    it('Should return a positive value if b.weight is greater than a.weight', () => {
      iSort1.checkpointWeight = 1;
      iSort2.checkpointWeight = 2;
      expect(feedbackService.compareWeight(iSort1, iSort2)).toBeGreaterThan(0);
    });

    it('Should return a negative value if a.weight is greater than b.weight', () => {
      iSort1.checkpointWeight = 2;
      iSort2.checkpointWeight = 1;
      expect(feedbackService.compareWeight(iSort1, iSort2)).toBeLessThan(0);
    });
  });
});
