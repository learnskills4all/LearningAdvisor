import { Test, TestingModule } from '@nestjs/testing';
import { ChangepasswordController } from './changepassword.controller';

describe('ChangepasswordController', () => {
  let controller: ChangepasswordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangepasswordController],
    }).compile();

    controller = module.get<ChangepasswordController>(ChangepasswordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
