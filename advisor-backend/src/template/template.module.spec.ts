import { Test } from '@nestjs/testing';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { TemplateController } from './template.controller';
import { TemplateModule } from './template.module';
import { TemplateService } from './template.service';
import { CategoryService } from '../category/category.service';

const moduleMocker = new ModuleMocker(global);

describe('TemplateModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [TemplateModule],
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
    expect(module.get(TemplateController)).toBeInstanceOf(TemplateController);
    expect(module.get(TemplateService)).toBeInstanceOf(TemplateService);
    expect(module.get(CategoryService)).toBeInstanceOf(CategoryService);
  });
});
