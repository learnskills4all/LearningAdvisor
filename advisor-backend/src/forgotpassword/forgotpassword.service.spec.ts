import { Test, TestingModule } from '@nestjs/testing';
import { ForgotpasswordService } from './forgotpassword.service';

describe('ForgotpasswordService', () => {
  let service: ForgotpasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForgotpasswordService],
    }).compile();

    service = module.get<ForgotpasswordService>(ForgotpasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
