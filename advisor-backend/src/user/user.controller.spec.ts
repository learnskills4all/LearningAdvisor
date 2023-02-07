import { Test, TestingModule } from '../../node_modules/@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import {
  AssessorUser,
  aUser,
  updateUserDtoAssessor,
  userArray,
} from '../prisma/mock/mockUser';

const moduleMocker = new ModuleMocker(global);

/**
 * Test user controller
 */
describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    process.env = {
      DATABASE_URL: 'postgres://localhost:5432/test',
      JWT_SECRET: 'mycustomuselongsecret',
      EXPIRESIN: '60 days',
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    })
      .useMocker((token) => {
        if (token === UserService) {
          return {
            getUser: jest.fn().mockResolvedValue(aUser),
            findAll: jest.fn().mockResolvedValue(userArray),
            updateUser: jest.fn().mockResolvedValue(AssessorUser),
            delete: jest.fn().mockResolvedValue(aUser),
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

    userController = module.get<UserController>(UserController);
  });

  describe('Should be defined:', () => {
    it('userController', () => {
      expect(userController).toBeDefined();
    });

    it('FindAll function', () => {
      expect(userController.findAll).toBeDefined();
    });

    it('GetUser function', () => {
      expect(userController.getUser).toBeDefined();
    });

    it('UpdateUser function', () => {
      expect(userController.updateUser).toBeDefined();
    });

    it('Delete function', () => {
      expect(userController.delete).toBeDefined();
    });
  });

  describe('FindAll', () => {
    it('Should return all users', async () => {
      expect(userController.findAll()).resolves.toBe(userArray);
    });
  });

  describe('GetUser', () => {
    it('Should return the found user', async () => {
      expect(userController.getUser(aUser.user_id)).resolves.toBe(aUser);
    });
  });

  describe('UpdateUser', () => {
    it('Should return the user with role updated to Assessor', async () => {
      expect(
        userController.updateUser(aUser.user_id, updateUserDtoAssessor)
      ).resolves.toBe(AssessorUser);
    });
  });

  describe('Delete', () => {
    it('Should return the deleted user', async () => {
      expect(userController.delete(aUser.user_id)).resolves.toBe(aUser);
    });
  });
});
