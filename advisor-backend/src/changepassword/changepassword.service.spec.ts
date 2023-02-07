import { Test, TestingModule } from '@nestjs/testing';
import { ChangepasswordService } from './changepassword.service';

describe('ChangepasswordService', () => {
  let service: ChangepasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangepasswordService],
    }).compile();

    service = module.get<ChangepasswordService>(ChangepasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
