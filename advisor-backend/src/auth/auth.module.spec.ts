import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

const moduleMocker = new ModuleMocker(global);

describe('AuthModule', () => {
  process.env = {
    DATABASE_URL: 'postgres://localhost:5432/test',
    JWT_SECRET: 'mycustomuselongsecret',
    EXPIRESIN: '60 days',
  };
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return Prisma;
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
    expect(module.get(AuthController)).toBeInstanceOf(AuthController);
    expect(module.get(AuthService)).toBeInstanceOf(AuthService);
  });
});
