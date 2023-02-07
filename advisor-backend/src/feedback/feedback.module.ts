import { Module } from '@nestjs/common';
import { TemplateService } from '../template/template.service';
import { AnswerService } from '../answer/answer.service';
import { CheckpointService } from '../checkpoint/checkpoint.service';
import { FeedbackService } from './feedback.service';
import { SaveService } from '../save/save.service';
import { TopicService } from '../topic/topic.service';
import { FeedbackController } from './feedback.controller';

// NestJS Module System helps structure application code into domain areas
//  leading to better design and improved maintainability.
// Controllers are responsible for handling incoming requests and returning responses to the client.
// Providers are responsible for executing business logic and returning data to the controller.
// Module for feedback related routes
@Module({
  controllers: [FeedbackController],
  providers: [
    FeedbackService,
    CheckpointService,
    AnswerService,
    TemplateService,
    SaveService,
    TopicService,
  ],
})
export class FeedbackModule {}
