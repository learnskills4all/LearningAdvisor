import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { aCategory } from '../prisma/mock/mockCategory';
import { SubareaService } from '../subarea/subarea.service';
import { aSubarea } from '../prisma/mock/mockSubarea';
import { aFullUser } from '../prisma/mock/mockUser';

const moduleMocker = new ModuleMocker(global);

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
    })
      .useMocker((token) => {
        if (token === CategoryService) {
          return {
            findOne: jest.fn().mockResolvedValue(aCategory),
            update: jest.fn().mockResolvedValue(aCategory),
            delete: jest.fn().mockResolvedValue(aCategory),
          };
        }
        if (token === SubareaService) {
          return {
            findAll: jest.fn().mockResolvedValue([aSubarea]),
            create: jest.fn().mockResolvedValue(aSubarea),
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

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('Should return the category', async () => {
      expect(await controller.findOne(1)).toEqual(aCategory);
    });
  });

  describe('update', () => {
    it('Should return the updated category', async () => {
      expect(await controller.update(1, {})).toEqual(aCategory);
    });
  });

  describe('delete', () => {
    it('Should return the deleted category', async () => {
      expect(await controller.delete(1)).toEqual(aCategory);
    });
  });

  describe('findAllSubareas', () => {
    it('Should return the subareas', async () => {
      expect(controller.findAllSubareas(1, aFullUser)).resolves.toEqual([
        aSubarea,
      ]);
    });
  });

  describe('createSubarea', () => {
    it('Should return the created subarea', async () => {
      expect(controller.createSubarea(1)).resolves.toEqual(aSubarea);
    });
  });
});
