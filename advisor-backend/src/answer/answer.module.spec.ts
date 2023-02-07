import { Test } from '@nestjs/testing';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { AnswerModule } from './answer.module';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';

const moduleMocker = new ModuleMocker(global);

describe('AnswerModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AnswerModule],
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
    expect(module.get(AnswerController)).toBeInstanceOf(AnswerController);
    expect(module.get(AnswerService)).toBeInstanceOf(AnswerService);
  });
});
