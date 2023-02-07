import { PartialType, PickType } from '@nestjs/swagger';
import { RecommendationDto } from './recommendation.dto';

// Data Transfer Object (DTO) for updating a recommendation
// PickType picks the listed properties from the given object
// PartialType makes the listed properties optional
export class UpdateRecommendationDto extends PartialType(
  PickType(RecommendationDto, ['feedback_additional_information', 'order'])
) {}
