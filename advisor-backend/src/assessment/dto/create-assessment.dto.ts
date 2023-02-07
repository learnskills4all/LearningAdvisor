import { PickType } from '@nestjs/swagger';
import { AssessmentDto } from './assessment.dto';

// Data transfer object for creating an assessment
// PickType picks the listed properties from the given object
export class CreateAssessmentDto extends PickType(AssessmentDto, [
  'assessment_type',
  'team_id',
  'template_id',
] as const) {}
