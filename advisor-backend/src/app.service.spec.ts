import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { AppService } from './app.service';
import { mockPrisma } from './prisma/mock/mockPrisma';
import { PrismaService } from './prisma/prisma.service';

const moduleMocker = new ModuleMocker(global);

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
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

    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('getHello', () => {
    it('Should return `Hello World!`', async () => {
      expect(appService.getHello()).toBe('Hello World!');
    });
  });
});
