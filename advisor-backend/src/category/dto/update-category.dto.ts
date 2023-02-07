import { OmitType, PartialType } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';

// Data Transfer Object (DTO) for updating a category
// OmitType ommits the listed properties from the given object
// PartialType makes the listed properties optional
export class UpdateCategoryDto extends PartialType(
  OmitType(CategoryDto, ['category_id', 'template_id'] as const)
) {}
