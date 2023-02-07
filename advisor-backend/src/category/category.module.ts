import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SubareaService } from '../subarea/subarea.service';
import { CheckpointService } from '../checkpoint/checkpoint.service';
import { TemplateService } from '../template/template.service';
import { TopicService } from '../topic/topic.service';

// NestJS Module System helps structure application code into domain areas
//  leading to better design and improved maintainability.
// Controllers are responsible for handling incoming requests and returning responses to the client.
// Providers are responsible for executing business logic and returning data to the controller.
// Module for category related routes
@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    SubareaService,
    CheckpointService,
    TemplateService,
    TopicService,
  ],
})
export class CategoryModule {}
