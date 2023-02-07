import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssessmentType } from '@prisma/client';

// Data transfer object for an assessment
// ApiProperty is used for the swagger documentation
// Default gives example values of the properties for the swagger documentation
export class AssessmentDto {
  @ApiProperty({ default: 1 })
  assessment_id: number;

  // The type of the assessment (individual or team)
  @ApiProperty({ enum: AssessmentType, default: AssessmentType.INDIVIDUAL })
  assessment_type: AssessmentType;

  @ApiProperty({ default: 'Netherlands' })
  country_name: string;

  @ApiProperty({ default: 'IT' })
  department_name: string;

  @ApiProperty({ default: 1 })
  template_id: number;

  @ApiProperty({ default: '' })
  feedback_text: string;

  @ApiProperty({ default: '' })
  information: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  // Filled in when all of the assessment checkpoints have been filled in
  // Optional
  @ApiPropertyOptional()
  completed_at?: Date;

  // Used for team assessments
  // Optional
  @ApiPropertyOptional({ default: 1 })
  team_id?: number;
}
