import { Test, TestingModule } from '@nestjs/testing';
import { CheckpointController } from './checkpoint.controller';
import { CheckpointService } from './checkpoint.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { aCheckpoint } from '../prisma/mock/mockCheckpoint';

const moduleMocker = new ModuleMocker(global);

describe('CheckpointController', () => {
  let controller: CheckpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckpointController],
    })
      .useMocker((token) => {
        if (token === CheckpointService) {
          return {
            findOne: jest.fn().mockResolvedValue(aCheckpoint),
            update: jest.fn().mockResolvedValue(aCheckpoint),
            delete: jest.fn().mockResolvedValue(aCheckpoint),
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

    controller = module.get<CheckpointController>(CheckpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return checkpoint', async () => {
      expect(controller.findOne(1)).resolves.toBe(aCheckpoint);
    });
  });

  describe('update', () => {
    it('should update checkpoint', async () => {
      expect(controller.update(1, aCheckpoint)).resolves.toBe(aCheckpoint);
    });
  });

  describe('delete', () => {
    it('should delete checkpoint', async () => {
      expect(controller.delete(1)).resolves.toBe(aCheckpoint);
    });
  });
});
