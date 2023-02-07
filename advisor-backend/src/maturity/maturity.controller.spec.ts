import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { aMaturity } from '../prisma/mock/mockMaturity';
import { MaturityController } from './maturity.controller';
import { MaturityService } from './maturity.service';

const moduleMocker = new ModuleMocker(global);

describe('MaturityController', () => {
  let controller: MaturityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaturityController],
    })
      .useMocker((token) => {
        if (token === MaturityService) {
          return {
            findOne: jest.fn().mockResolvedValue(aMaturity),
            update: jest.fn().mockResolvedValue(aMaturity),
            delete: jest.fn().mockResolvedValue(aMaturity),
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

    controller = module.get<MaturityController>(MaturityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('Should return the category', async () => {
      expect(await controller.findOne(1)).toEqual(aMaturity);
    });
  });

  describe('update', () => {
    it('Should return the updated category', async () => {
      expect(await controller.update(1, {})).toEqual(aMaturity);
    });
  });

  describe('delete', () => {
    it('Should return the deleted category', async () => {
      expect(await controller.delete(1)).toEqual(aMaturity);
    });
  });
});
