import { OmitType, PartialType } from '@nestjs/swagger';
import { TemplateDto } from './template.dto';

/**
 * DTO for creating a new template
 */
export class UpdateTemplateDto extends PartialType(
  OmitType(TemplateDto, ['template_id'])
) {}
