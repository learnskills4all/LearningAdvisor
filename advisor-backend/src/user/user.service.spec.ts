import { Test, TestingModule } from '../../node_modules/@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { mockPrisma } from '../prisma/mock/mockPrisma';
import {
  AdminUser,
  AssessorUser,
  aUser,
  updateUserDto,
  updateUserDtoAdmin,
  updateUserDtoAssessor,
  userArray,
} from '../prisma/mock/mockUser';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { registerDto } from '../prisma/mock/mockAuthService';
import * as bcrypt from 'bcrypt';

const moduleMocker = new ModuleMocker(global);

describe('UserService', () => {
  let userService: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    process.env = {
      DATABASE_URL: 'postgres://localhost:5432/test',
      JWT_SECRET: 'mycustomuselongsecret',
      EXPIRESIN: '60 days',
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return mockPrisma;
        }
        if (token === UserService) {
          return {
            bcrypt: jest.mock('uuidv4'),
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

    userService = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('Should be defined:', () => {
    it('userService', () => {
      expect(userService).toBeDefined();
    });

    it('createUser function', () => {
      expect(userService.createUser).toBeDefined();
    });

    it('delete function', () => {
      expect(userService.delete).toBeDefined();
    });

    it('findAll function', () => {
      expect(userService.findAll).toBeDefined();
    });

    it('getUser function', () => {
      expect(userService.getUser).toBeDefined();
    });

    it('updateUser function', () => {
      expect(userService.updateUser).toBeDefined();
    });
  });

  describe('FindAll', () => {
    it('Should return all the found users', async () => {
      expect(userService.findAll()).resolves.toBe(userArray);
    });
  });

  describe('GetUser', () => {
    it('Should return the found users', async () => {
      expect(userService.getUser(aUser.user_id)).resolves.toBe(aUser);
    });

    it('Should reject if user with given user_id is not found', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce(null);
      expect(userService.getUser(aUser.user_id)).rejects.toThrowError(
        NotFoundException
      );
    });
  });

  describe('UpdateUser', () => {
    it('Should throw NotFoundException if user is not found', async () => {
      jest.spyOn(prisma.user, 'update').mockRejectedValue({ code: 'P2025' });
      expect(
        userService.updateUser(aUser.user_id, updateUserDto)
      ).rejects.toThrowError(NotFoundException);
    });

    it('Should reject with unknown error', async () => {
      jest.spyOn(prisma.user, 'update').mockRejectedValue({ code: 'TEST' });
      expect(
        userService.updateUser(aUser.user_id, updateUserDto)
      ).rejects.toThrowError(InternalServerErrorException);
    });

    it('should return user with role modified to assessor', async () => {
      jest.spyOn(prisma.user, 'update').mockResolvedValueOnce(AssessorUser);
      expect(
        (await userService.updateUser(aUser.user_id, updateUserDtoAssessor))
          .role
      ).toEqual(AssessorUser.role);
    });

    it('should return user with role modified to admin', async () => {
      jest.spyOn(prisma.user, 'update').mockResolvedValueOnce(AdminUser);
      expect(
        (await userService.updateUser(aUser.user_id, updateUserDtoAdmin)).role
      ).toEqual(AdminUser.role);
    });
  });

  describe('CreateUsers', () => {
    // mocking the bcrypt hashing function
    const bcryptHash = jest.fn().mockResolvedValue(aUser.password);
    (bcrypt.hash as jest.Mock) = bcryptHash;

    it('Should return the right username', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
      expect((await userService.createUser(registerDto)).username).toEqual(
        aUser.username
      );
    });

    it('Should throw BadRequestException if user is found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(aUser);
      expect(userService.createUser(registerDto)).rejects.toThrowError(
        BadRequestException
      );
    });

    it('Should throw ConflictException', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
      jest
        .spyOn(prisma.user, 'create')
        .mockRejectedValueOnce({ code: 'P2002' });
      expect(userService.createUser(registerDto)).rejects.toThrowError(
        ConflictException
      );
    });

    it('Should reject with unknown error', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
      jest.spyOn(prisma.user, 'create').mockRejectedValueOnce({ code: 'TEST' });
      expect(userService.createUser(registerDto)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });

  describe('Delete', () => {
    it('Should throw NotFoundException if not found', async () => {
      jest
        .spyOn(prisma.user, 'delete')
        .mockRejectedValueOnce({ code: 'P2025' });
      expect(userService.delete(aUser.user_id)).rejects.toThrowError(
        NotFoundException
      );
    });

    it('Should reject with unknown error', async () => {
      jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce({ code: 'TEST' });
      expect(userService.delete(aUser.user_id)).rejects.toThrowError(
        InternalServerErrorException
      );
    });
  });
});
