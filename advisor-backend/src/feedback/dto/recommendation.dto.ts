import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

// Data Transfer Object (DTO) for recommendation
// ApiProperty decorator is used to define Swagger UI properties for this class
// Default value is used for swagger UI as example values
// Min decorator is used to define the minimum value for the property
export class RecommendationDto {
  // Optional property
  @ApiProperty({ default: 1 })
  feedback_id?: number;

  // Optional property
  @ApiProperty({ default: 1 })
  @Min(1)
  order?: number;

  @ApiProperty({ default: 'Feedback example' })
  feedback_text: string;

  @ApiProperty({ default: '' })
  feedback_additional_information: string;

  @ApiProperty({ default: [1] })
  topic_ids: number[];
}
