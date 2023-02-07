import { Test } from '@nestjs/testing';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { CheckpointModule } from './checkpoint.module';
import { CheckpointController } from './checkpoint.controller';
import { CheckpointService } from './checkpoint.service';

const moduleMocker = new ModuleMocker(global);

describe('CheckpointModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [CheckpointModule],
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
    expect(module.get(CheckpointController)).toBeInstanceOf(
      CheckpointController
    );
    expect(module.get(CheckpointService)).toBeInstanceOf(CheckpointService);
  });
});
