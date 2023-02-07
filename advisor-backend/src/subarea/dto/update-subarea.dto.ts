import { OmitType, PartialType } from '@nestjs/swagger';
import { SubareaDto } from './subarea.dto';

// Data Transfer Object (DTO) for updating a subarea
// OmitType ommits the listed properties from the given object
// PartialType makes the listed properties optional
export class UpdateSubareaDto extends PartialType(
  OmitType(SubareaDto, ['category_id', 'subarea_id'])
) {}
