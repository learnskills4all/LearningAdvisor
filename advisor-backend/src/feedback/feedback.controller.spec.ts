import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { aFeedback } from '../prisma/mock/mockFeedback';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

const moduleMocker = new ModuleMocker(global);

describe('FeedbackController', () => {
  let controller: FeedbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
    })
      .useMocker((token) => {
        if (token === FeedbackService) {
          return {
            updateRecommendation: jest.fn().mockResolvedValue(aFeedback),
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

    controller = module.get<FeedbackController>(FeedbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateRecommendations', () => {
    it('Should return the category', () => {
      expect(controller.updateRecommendation(1, aFeedback)).resolves.toBe(
        aFeedback
      );
    });
  });
});
