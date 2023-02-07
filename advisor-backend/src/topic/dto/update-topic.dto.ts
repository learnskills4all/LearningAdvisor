import { PartialType, PickType } from '@nestjs/swagger';
import { TopicDto } from './topic.dto';

// Data Transfer Object (DTO) for updating a topic
// PickType picks the listed properties from the given object
// PartialType makes the listed properties optional
export class UpdateTopicDto extends PartialType(
  PickType(TopicDto, ['topic_name', 'disabled'])
) {}
