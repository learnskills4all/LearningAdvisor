import { PickType } from '@nestjs/swagger';
import { AssessmentDto } from './assessment.dto';

// Data transfer object for the the feedback of an assessment
// PickType picks the listed properties from the given object
export class FeedbackDto extends PickType(AssessmentDto, ['feedback_text']) {}
