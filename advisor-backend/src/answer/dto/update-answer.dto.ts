import { PartialType, PickType } from '@nestjs/swagger';
import { AnswerDto } from './answer.dto';

// Data Transfer Object (DTO) for updating an answer
// ApiProperty decorator is used to define Swagger UI properties for this class
// PartialType makes the listed properties optional
// PickType picks the listed properties from the given object
export class UpdateAnswerDto extends PartialType(
  PickType(AnswerDto, ['answer_text', 'answer_weight', 'disabled'] as const)
) {}
