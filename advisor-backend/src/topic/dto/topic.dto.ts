import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

// Data Transfer Object (DTO) for topic
// ApiProperty decorator is used to define Swagger UI properties for this class
// Default value is used for swagger UI as example values
// IsBoolean decorator is used to define the property as a boolean
export class TopicDto {
  @ApiProperty({ default: 1 })
  topic_id: number;

  @ApiProperty({ default: 'New Topic' })
  topic_name: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  disabled: boolean;

  @ApiProperty({ default: 1 })
  template_id: number;
}
