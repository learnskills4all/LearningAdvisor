import { Test, TestingModule } from '@nestjs/testing';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { aTopic } from '../prisma/mock/mockTopic';

const moduleMocker = new ModuleMocker(global);

describe('TopicController', () => {
  let controller: TopicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
    })
      .useMocker((token) => {
        if (token === TopicService) {
          return {
            findOne: jest.fn().mockResolvedValue(aTopic),
            update: jest.fn().mockResolvedValue(aTopic),
            delete: jest.fn().mockResolvedValue(aTopic),
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

    controller = module.get<TopicController>(TopicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return topic', async () => {
      expect(controller.findOne(1)).resolves.toBe(aTopic);
    });
  });

  describe('update', () => {
    it('should update topic', async () => {
      expect(controller.update(1, aTopic)).resolves.toBe(aTopic);
    });
  });

  describe('delete', () => {
    it('should delete topic', async () => {
      expect(controller.delete(1)).resolves.toBe(aTopic);
    });
  });
});
