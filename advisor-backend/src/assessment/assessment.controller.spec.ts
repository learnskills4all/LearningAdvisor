import { Test, TestingModule } from '@nestjs/testing';
import {
  aAssessment,
  aAssessmentFeedback,
  aRecommendation,
} from '../prisma/mock/mockAssessment';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';
import { aFullUser1 } from '../prisma/mock/mockAuthService';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { SaveCheckpointDto } from '../save/dto/save-checkpoint.dto';
import { SaveService } from '../save/save.service';
import { AssessmentScoreService } from './assessment-score.service';
import { FeedbackService } from '../feedback/feedback.service';
import { aScore } from '../prisma/mock/mockScore';

const moduleMocker = new ModuleMocker(global);

describe('AssessmentController', () => {
  let assessmentController: AssessmentController;
  let assessmentService: AssessmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentController],
    })
      .useMocker((token) => {
        if (token === AssessmentService) {
          return {
            create: jest.fn().mockResolvedValue(aAssessment),
            findAll: jest.fn().mockResolvedValue([aAssessment]),
            findOne: jest.fn().mockResolvedValue(aAssessment),
            update: jest.fn().mockResolvedValue(aAssessment),
            delete: jest.fn().mockResolvedValue(aAssessment),
            complete: jest.fn().mockResolvedValue(aAssessment),
            userInAssessment: jest.fn().mockResolvedValue(true),
            findUserAssessments: jest.fn().mockResolvedValue([aAssessment]),
            feedback: jest.fn().mockResolvedValue(aAssessmentFeedback),
          };
        }
        if (token === SaveService) {
          return {
            saveCheckpoint: jest.fn().mockResolvedValue({
              msg: 'Checkpoint saved',
            }),
            getSavedCheckpoints: jest.fn().mockResolvedValue([aAssessment]),
          };
        }
        if (token === AssessmentScoreService) {
          return {
            getScore: jest.fn().mockResolvedValue([aScore]),
          };
        }
        if (token === FeedbackService) {
          return {
            getRecommendations: jest.fn().mockResolvedValue([aRecommendation]),
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

    assessmentController =
      module.get<AssessmentController>(AssessmentController);
    assessmentService = module.get<AssessmentService>(AssessmentService);
  });

  it('should be defined', () => {
    expect(assessmentController).toBeDefined();
  });

  describe('create', () => {
    it('Should return the created assessment', async () => {
      expect(assessmentController.create(aAssessment, undefined)).resolves.toBe(
        aAssessment
      );
    });
  });

  describe('findAll', () => {
    it('Should return all assessments', async () => {
      expect(assessmentController.findAll()).resolves.toEqual([aAssessment]);
    });
  });

  describe('findOne', () => {
    it('Should return the assessment', async () => {
      expect(assessmentController.findOne(1, aFullUser1)).resolves.toBe(
        aAssessment
      );
    });

    it('Should throw error if user is not in assessment', async () => {
      jest.spyOn(assessmentService, 'userInAssessment').mockResolvedValue(null);
      expect(assessmentController.findOne(1, aFullUser1)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('update', () => {
    it('Should return the updated assessment', async () => {
      expect(
        assessmentController.update(1, aAssessment, aFullUser1)
      ).resolves.toBe(aAssessment);
    });

    it('Should throw error if user is not in assessment', async () => {
      jest.spyOn(assessmentService, 'userInAssessment').mockResolvedValue(null);
      expect(
        assessmentController.update(1, aAssessment, aFullUser1)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('Should return the deleted assessment', async () => {
      expect(assessmentController.delete(1, aFullUser1)).resolves.toBe(
        aAssessment
      );
    });

    it('Should throw error if user is not in assessment', async () => {
      jest.spyOn(assessmentService, 'userInAssessment').mockResolvedValue(null);
      expect(assessmentController.delete(1, aFullUser1)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('complete', () => {
    it('Should return the completed assessment', async () => {
      expect(assessmentController.complete(1, aFullUser1)).resolves.toBe(
        aAssessment
      );
    });

    it('Should throw error if user is not in assessment', async () => {
      jest.spyOn(assessmentService, 'userInAssessment').mockResolvedValue(null);
      expect(assessmentController.complete(1, aFullUser1)).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('get my assessments', () => {
    it('Should return the assessments', async () => {
      expect(
        assessmentController.findUserAssessments(aFullUser1)
      ).resolves.toEqual([aAssessment]);
    });
  });

  describe('saveCheckpointAnswer', () => {
    it('Should return success message object', async () => {
      expect(
        assessmentController.saveCheckpointAnswer(
          1,
          { checkpoint_id: 1, answer_id: 1 } as SaveCheckpointDto,
          aFullUser1
        )
      ).resolves.toEqual({
        msg: 'Checkpoint saved',
      });
    });

    it('Should throw error if user is not in assessment', async () => {
      jest.spyOn(assessmentService, 'userInAssessment').mockResolvedValue(null);
      expect(
        assessmentController.saveCheckpointAnswer(
          1,
          { checkpoint_id: 1, answer_id: 1 } as SaveCheckpointDto,
          aFullUser1
        )
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getSavedCheckpoints', () => {
    it('Should return the saved checkpoints', async () => {
      expect(
        assessmentController.getSavedCheckpoints(1, aFullUser1)
      ).resolves.toEqual([aAssessment]);
    });

    it('Should throw error if user is not in assessment', async () => {
      jest.spyOn(assessmentService, 'userInAssessment').mockResolvedValue(null);
      expect(
        assessmentController.getSavedCheckpoints(1, aFullUser1)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Add feedback to assessment', () => {
    it('Should return the assessment', async () => {
      expect(
        assessmentController.feedback(1, {
          ...aAssessment,
          feedback_text: 'test_feedback_text',
        })
      ).resolves.toEqual(aAssessmentFeedback);
    });
  });

  describe('Get score for all topics', () => {
    it('Should return the score', async () => {
      expect(assessmentController.getScore(1)).resolves.toEqual([aScore]);
    });
  });

  describe('Get recommendations', () => {
    it('Should return the recommendations', async () => {
      expect(
        assessmentController.getRecommendations(1, aFullUser1)
      ).resolves.toEqual([aRecommendation]);
    });

    it('Should throw error if user is not in assessment', async () => {
      jest.spyOn(assessmentService, 'userInAssessment').mockResolvedValue(null);
      expect(
        assessmentController.getRecommendations(1, aFullUser1)
      ).rejects.toThrow(NotFoundException);
    });
  });
});
