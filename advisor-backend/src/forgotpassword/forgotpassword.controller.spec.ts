import { Test, TestingModule } from '@nestjs/testing';
import { ForgotpasswordController } from './forgotpassword.controller';

describe('ForgotpasswordController', () => {
  let controller: ForgotpasswordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForgotpasswordController],
    }).compile();

    controller = module.get<ForgotpasswordController>(ForgotpasswordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
