import { Module } from '@nestjs/common';
import { MaturityService } from '../maturity/maturity.service';
import { CategoryService } from '../category/category.service';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { TopicService } from '../topic/topic.service';
import { AnswerService } from '../answer/answer.service';
import { CloneTemplateService } from './clone-template.service';

// NestJS Module System helps structure application code into domain areas
//  leading to better design and improved maintainability.
// Controllers are responsible for handling incoming requests and returning responses to the client.
// Providers are responsible for executing business logic and returning data to the controller.
// Module for template related routes
@Module({
  controllers: [TemplateController],
  providers: [
    TemplateService,
    CloneTemplateService,
    CategoryService,
    MaturityService,
    TopicService,
    AnswerService,
  ],
})
export class TemplateModule {}
