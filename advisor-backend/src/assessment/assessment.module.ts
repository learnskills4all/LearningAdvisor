import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { TemplateService } from '../template/template.service';
import { FeedbackService } from '../feedback/feedback.service';
import { AssessmentScoreService } from './assessment-score.service';
import { SaveService } from '../save/save.service';
import { CheckpointService } from '../checkpoint/checkpoint.service';
import { TopicService } from '../topic/topic.service';

// NestJS Module System helps structure application code into domain areas
//  leading to better design and improved maintainability.
// Controllers are responsible for handling incoming requests and returning responses to the client.
// Providers are responsible for executing business logic and returning data to the controller.
// Module for assessment related routes
@Module({
  controllers: [AssessmentController],
  providers: [
    AssessmentService,
    AssessmentScoreService,
    CheckpointService,
    FeedbackService,
    TemplateService,
    SaveService,
    CheckpointService,
    TopicService,
    SaveService,
  ],
})
export class AssessmentModule {}
