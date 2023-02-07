import { PartialType, PickType } from '@nestjs/swagger';
import { AssessmentDto } from './assessment.dto';

// Data transfer object for updating an assessment
// PickType picks the listed properties from the given object
// PartialType makes the listed properties optional
export class UpdateAssessmentDto extends PartialType(
  PickType(AssessmentDto, ['country_name', 'department_name'])
) {}
