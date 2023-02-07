import { ApiProperty } from '@nestjs/swagger';
import { AssessmentType } from '@prisma/client';
import { IsBoolean, IsEnum, Min } from 'class-validator';

// Data Transfer Object (DTO) for assessment
// ApiProperty decorator is used to define Swagger UI properties for this class
// Default value is used for swagger UI as example values
// IsBoolean decorator is used to define the property as a boolean
// IsEnum decorator is used to define the property as an enum
// Min decorator is used to define the minimum value for the property
export class TemplateDto {
  @ApiProperty({ default: 1 })
  template_id: number;

  @ApiProperty({ default: 'New Template' })
  template_name: string;

  @ApiProperty({ default: '' })
  template_description: string;

  @ApiProperty({ enum: AssessmentType, default: AssessmentType.INDIVIDUAL })
  @IsEnum(AssessmentType)
  template_type: AssessmentType;

  @ApiProperty({ default: '' })
  template_feedback: string;

  @ApiProperty({ default: '' })
  information: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  enabled: boolean;

  // Used for checkpoints weights
  @ApiProperty({ default: 1 })
  @Min(0)
  weight_range_min: number;

  // Used for checkpoints weights
  @ApiProperty({ default: 3 })
  weight_range_max: number;

  @ApiProperty({ default: true })
  @IsBoolean()
  include_no_answer: boolean;
}
