import { Test } from '@nestjs/testing';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { MaturityModule } from './maturity.module';
import { MaturityController } from './maturity.controller';
import { MaturityService } from './maturity.service';

const moduleMocker = new ModuleMocker(global);

describe('MaturityModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [MaturityModule],
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
    expect(module.get(MaturityController)).toBeInstanceOf(MaturityController);
    expect(module.get(MaturityService)).toBeInstanceOf(MaturityService);
  });
});
