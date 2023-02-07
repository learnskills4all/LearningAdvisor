import { Module } from '@nestjs/common';
import { ChangepasswordController } from './changepassword.controller';
import { ChangepasswordService } from './changepassword.service';

@Module({
  controllers: [ChangepasswordController],
  providers: [ChangepasswordService]
})
export class ChangepasswordModule {}
