import { Test, TestingModule } from '@nestjs/testing';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { aAnswer } from '../prisma/mock/mockAnswer';

const moduleMocker = new ModuleMocker(global);

describe('AnswerController', () => {
  let answerController: AnswerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerController],
    })
      .useMocker((token) => {
        if (token === AnswerService) {
          return {
            findOne: jest.fn().mockResolvedValue(aAnswer),
            update: jest.fn().mockResolvedValue(aAnswer),
            delete: jest.fn().mockResolvedValue(aAnswer),
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

    answerController = module.get<AnswerController>(AnswerController);
  });

  it('should be defined', () => {
    expect(answerController).toBeDefined();
  });

  describe('findOne', () => {
    it('should return answer', async () => {
      expect(answerController.findOne(1)).resolves.toBe(aAnswer);
    });
  });

  describe('update', () => {
    it('should update answer', async () => {
      expect(answerController.update(1, aAnswer)).resolves.toBe(aAnswer);
    });
  });

  describe('delete', () => {
    it('should delete answer', async () => {
      expect(answerController.delete(1)).resolves.toBe(aAnswer);
    });
  });
});
