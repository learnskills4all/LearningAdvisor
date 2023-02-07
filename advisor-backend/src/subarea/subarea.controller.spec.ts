import { Test, TestingModule } from '@nestjs/testing';
import { aSubarea } from '../prisma/mock/mockSubarea';
import { SubareaController } from './subarea.controller';
import { SubareaService } from './subarea.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('SubareaController', () => {
  let controller: SubareaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubareaController],
    })
      .useMocker((token) => {
        if (token === SubareaService) {
          return {
            findOne: jest.fn().mockResolvedValue(aSubarea),
            update: jest.fn().mockResolvedValue(aSubarea),
            delete: jest.fn().mockResolvedValue(aSubarea),
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

    controller = module.get<SubareaController>(SubareaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the created subarea', async () => {
      expect(controller.findOne(1)).resolves.toBe(aSubarea);
    });
  });

  describe('update', () => {
    it('should return the updated subarea', async () => {
      expect(controller.update(1, aSubarea)).resolves.toBe(aSubarea);
    });
  });

  describe('delete', () => {
    it('should return the deleted subarea', async () => {
      expect(controller.delete(1)).resolves.toBe(aSubarea);
    });
  });
});
