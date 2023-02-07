import { PickType } from '@nestjs/swagger';
import { TemplateDto } from './template.dto';

/**
 * DTO for creating a new template
 */
export class CreateTemplateDto extends PickType(TemplateDto, [
  'template_type',
]) {}
