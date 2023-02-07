import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  userDto,
  mockPrisma,
  aUser,
  registerDto,
  userAuthentication,
} from '../prisma/mock/mockAuthService';
import { JwtStrategy } from './jwt.strategy';
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const moduleMocker = new ModuleMocker(global);

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    process.env = {
      DATABASE_URL: 'postgres://localhost:5432/test',
      JWT_SECRET: 'mycustomuselongsecret',
      EXPIRESIN: '60 days',
    };
    const module = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.EXPIRESIN,
          },
        }),
      ],
      providers: [
        JwtStrategy,
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    })
      .useMocker((token) => {
        if (token === UserService) {
          return {
            createUser: jest.fn().mockResolvedValue(aUser),
          };
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
    authService = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('should be defined', () => {
    it('Authentication', () => {
      expect(authService).toBeDefined();
    });

    it('login function', () => {
      expect(authService.login(userDto)).toBeDefined();
    });

    it('registration function', () => {
      expect(authService.register(registerDto)).toBeDefined();
    });
  });

  describe('When registering', () => {
    it('should return an AuthResponse type', async () => {
      expect(typeof authService.register(registerDto)).toEqual(
        typeof userAuthentication
      );
    });

    it('should return the correct user', async () => {
      expect((await authService.register(registerDto)).user).toEqual(
        userAuthentication.user
      );
    });
  });

  describe('When logging in', () => {
    it('should return an AuthResponse type', async () => {
      expect(typeof authService.login(userDto)).toEqual(
        typeof userAuthentication
      );
    });

    it('should return the correct user', async () => {
      expect((await authService.login(userDto)).user).toEqual(
        userAuthentication.user
      );
    });

    it('should reject if username is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
      expect(authService.login(userDto)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('Should reject with unknown error', async () => {
      jest
        .spyOn(prisma.user, 'findUnique')
        .mockRejectedValueOnce({ code: 'TEST' });
      expect(authService.login(userDto)).rejects.toThrowError(
        InternalServerErrorException
      );
    });

    it('should reject if the password is invalid', async () => {
      // mocking bcrypt compare method
      const bcryptCompare = jest.fn().mockResolvedValue(null);
      (bcrypt.compare as jest.Mock) = bcryptCompare;
      expect(authService.login(userDto)).rejects.toThrowError(
        UnauthorizedException
      );
    });
  });
});
