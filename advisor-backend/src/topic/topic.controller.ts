import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { UpdateTopicDto } from './dto/update-topic.dto';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TopicDto } from './dto/topic.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('topic')
@ApiTags('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  /**
   * [GET] /topic/:topic_id - Get a topic
   * @param topic_id - Topic ID
   * @returns Topic
   * @throws Topic not found
   */
  @Get(':topic_id')
  @ApiResponse({
    description: 'Found topic',
    type: TopicDto,
  })
  @ApiNotFoundResponse({ description: 'Topic not found' })
  findOne(@Param('topic_id', ParseIntPipe) topic_id: number) {
    return this.topicService.findOne(topic_id);
  }

  /**
   * [PATCH] /topic/:topic_id - Update a topic
   * @param topic_id - Topic ID
   * @param updateTopicDto - Topic name
   * @returns Updated topic
   * @throws Topic not found
   * @throws Topic with this name already exists
   */
  @Patch(':topic_id')
  @Roles(Role.ADMIN)
  @ApiResponse({
    description: 'Created topic',
    type: TopicDto,
  })
  @ApiNotFoundResponse({ description: 'Topic not found' })
  @ApiConflictResponse({ description: 'Topic with this name already exists' })
  update(
    @Param('topic_id', ParseIntPipe) topic_id: number,
    @Body() updateTopicDto: UpdateTopicDto
  ) {
    return this.topicService.update(topic_id, updateTopicDto);
  }

  /**
   * [DELETE] /topic/:topic_id - Delete a topic
   * @param topic_id - Topic ID
   * @returns Deleted topic
   * @throws Topic not found
   */
  @Delete(':topic_id')
  @Roles(Role.ADMIN)
  @ApiResponse({
    description: 'Deleted topic',
    type: TopicDto,
  })
  @ApiNotFoundResponse({ description: 'Topic not found' })
  delete(@Param('topic_id', ParseIntPipe) topic_id: number) {
    return this.topicService.delete(topic_id);
  }
}
