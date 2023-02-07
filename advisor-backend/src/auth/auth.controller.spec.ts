import { Test, TestingModule } from '../../node_modules/@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import {
  loginDto,
  mockLogin,
  mockLogout,
  registerDto,
  userAuthentication,
  userinfo,
} from '../prisma/mock/mockAuthController';

const moduleMocker = new ModuleMocker(global);

const httpMocks = require('node-mocks-http');

// Basic request object
const req = httpMocks.createRequest();

// Basic response object
req.res = httpMocks.createResponse();

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    process.env = {
      DATABASE_URL: 'postgres://localhost:5432/test',
      JWT_SECRET: 'mycustomuselongsecret',
      EXPIRESIN: '60 days',
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return {
            register: jest.fn().mockResolvedValue(userAuthentication),
            login: jest.fn().mockResolvedValue(mockLogin),
            logout: jest.fn().mockResolvedValue(mockLogout),
            getLoggedUser: jest.fn().mockResolvedValue(userinfo),
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

    authController = module.get<AuthController>(AuthController);
  });

  describe('should be defined', () => {
    it('authController', () => {
      expect(authController).toBeDefined();
    });

    it('register function', () => {
      expect(authController.register(registerDto, req.res)).toBeDefined();
    });

    it('logout function', () => {
      expect(authController.logout(req.res)).toBeDefined();
    });

    it('getLoggedUser function', () => {
      expect(authController.getLoggedUser(userinfo)).toBeDefined();
    });
  });

  describe('register', () => {
    it('Should return the username of the created user', async () => {
      expect(
        (await authController.register(registerDto, req.res)).username
      ).toEqual(userinfo.username);
    });
  });

  describe('register', () => {
    it('Should return the password of the created user', async () => {
      expect(
        (await authController.register(registerDto, req.res)).password
      ).toEqual(userinfo.password);
    });
  });

  describe('login', () => {
    it('Should return a message showing a successful login', async () => {
      expect((await authController.login(loginDto, req.res)).msg).toEqual(
        mockLogin.msg
      );
    });
  });

  describe('get a user', () => {
    it('Should return user information', async () => {
      expect(authController.getLoggedUser(userinfo)).toEqual(userinfo);
    });
  });
});
