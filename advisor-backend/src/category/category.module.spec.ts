import { Test } from '@nestjs/testing';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { CategoryModule } from './category.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { SubareaService } from '../subarea/subarea.service';

const moduleMocker = new ModuleMocker(global);

describe('TemplateModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [CategoryModule],
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

    expect(module).toBeDefined();
    expect(module.get(CategoryController)).toBeInstanceOf(CategoryController);
    expect(module.get(CategoryService)).toBeInstanceOf(CategoryService);
    expect(module.get(SubareaService)).toBeInstanceOf(SubareaService);
  });
});
