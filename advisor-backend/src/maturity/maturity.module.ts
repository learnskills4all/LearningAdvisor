import { Module } from '@nestjs/common';
import { MaturityService } from './maturity.service';
import { MaturityController } from './maturity.controller';

// NestJS Module System helps structure application code into domain areas
//  leading to better design and improved maintainability.
// Controllers are responsible for handling incoming requests and returning responses to the client.
// Providers are responsible for executing business logic and returning data to the controller.
// Module for maturity related routes
@Module({
  controllers: [MaturityController],
  providers: [MaturityService],
})
export class MaturityModule {}
