import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { PrismaService } from '../prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import { aUser } from '../prisma/mock/mockUser';
import { UnauthorizedException } from '@nestjs/common';
import { userAuthentication } from '../prisma/mock/mockAuthService';
import { LocalStrategy } from './local_strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import * as bcrypt from 'bcrypt';

const moduleMocker = new ModuleMocker(global);

describe('AuthService', () => {
  let authService: AuthService;
  let localStrategy: LocalStrategy;

  beforeEach(async () => {
    process.env = {
      DATABASE_URL: 'postgres://localhost:5432/test',
      JWT_SECRET: 'mycustomuselongsecret',
      EXPIRESIN: '60 days',
    };
    const module = await Test.createTestingModule({
      imports: [PassportModule],
      providers: [
        LocalStrategy,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
      controllers: [AuthController],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return {
            login: jest.fn().mockResolvedValue(userAuthentication),
          };
        }
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
    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  describe('should be defined', () => {
    it('JwtStrategy', () => {
      expect(localStrategy).toBeDefined();
    });

    it('JwtStrategy validate function', async () => {
      expect(
        localStrategy.validate(aUser.username, aUser.password)
      ).toBeDefined();
    });
  });

  describe('Validate function', () => {
    // mocking bcrypt compare method
    const bcryptCompare = jest.fn().mockResolvedValue(null);
    (bcrypt.compare as jest.Mock) = bcryptCompare;
    it('Validate', async () => {
      expect(
        await localStrategy.validate(
          userAuthentication.user.username,
          userAuthentication.user.password
        )
      ).toEqual(userAuthentication.user);
    });

    it('Should reject with unknown error', async () => {
      jest
        .spyOn(authService, 'login')
        .mockResolvedValue({ token: 'something', user: null });
      expect(
        localStrategy.validate(aUser.username, aUser.password)
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
