import { Module } from '@nestjs/common';
import { CheckpointService } from './checkpoint.service';
import { CheckpointController } from './checkpoint.controller';
import { TemplateService } from '../template/template.service';
import { TopicService } from '../topic/topic.service';

// NestJS Module System helps structure application code into domain areas
//  leading to better design and improved maintainability.
// Controllers are responsible for handling incoming requests and returning responses to the client.
// Providers are responsible for executing business logic and returning data to the controller.
// Module for checkpoint related routes
@Module({
  controllers: [CheckpointController],
  providers: [CheckpointService, TemplateService, TopicService],
})
export class CheckpointModule {}
