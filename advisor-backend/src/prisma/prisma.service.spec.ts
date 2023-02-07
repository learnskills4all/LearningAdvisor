import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prisma: PrismaService;

  beforeEach(async () => {
    process.env = {
      DATABASE_URL: 'postgres://localhost:5432/test',
      JWT_SECRET: 'mycustomuselongsecret',
      EXPIRESIN: '60 days',
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
  });

  describe('moduleInit', () => {
    it('should call $connect', async () => {
      jest.spyOn(prisma, '$connect').mockImplementation();
      await prisma.onModuleInit();
      expect(prisma.$connect).toHaveBeenCalled();
    });
  });

  describe('enableShutdownHooks', () => {
    it('should call $on', async () => {
      jest.spyOn(prisma, '$on').mockImplementation();
      await prisma.enableShutdownHooks(null);
      expect(prisma.$on).toHaveBeenCalled();
    });
  });

  describe('beforeExit', () => {
    it('should call app.close', async () => {
      const app = {
        close: jest.fn().mockImplementation(),
      };
      await prisma.beforeExit(app as unknown as INestApplication);
      expect(app.close).toHaveBeenCalled();
    });
  });
});
