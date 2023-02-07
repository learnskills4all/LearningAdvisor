import { Test } from '@nestjs/testing';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { TopicModule } from './topic.module';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

const moduleMocker = new ModuleMocker(global);

describe('TopicModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [TopicModule],
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
    expect(module.get(TopicController)).toBeInstanceOf(TopicController);
    expect(module.get(TopicService)).toBeInstanceOf(TopicService);
  });
});
