import { OmitType, PartialType } from '@nestjs/swagger';
import { MaturityDto } from './maturity.dto';

// Data Transfer Object (DTO) for updating a maturity
// OmitType ommits the listed properties from the given object
// PartialType makes the listed properties optional
export class UpdateMaturityDto extends PartialType(
  OmitType(MaturityDto, ['maturity_id', 'template_id'] as const)
) {}
