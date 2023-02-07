import { Module } from '@nestjs/common';
import { SubareaService } from './subarea.service';
import { SubareaController } from './subarea.controller';

// NestJS Module System helps structure application code into domain areas
//  leading to better design and improved maintainability.
// Controllers are responsible for handling incoming requests and returning responses to the client.
// Providers are responsible for executing business logic and returning data to the controller.
// Module for subarea related routes
@Module({
  controllers: [SubareaController],
  providers: [SubareaService],
})
export class SubareaModule {}
