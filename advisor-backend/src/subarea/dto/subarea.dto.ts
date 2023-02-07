import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

// Data Transfer Object (DTO) for subarea
// ApiProperty decorator is used to define Swagger UI properties for this class
// Default value is used for swagger UI as example values
// Min decorator is used to define the minimum value for the property
export class SubareaDto {
  @ApiProperty({ default: 1 })
  subarea_id: number;

  @ApiProperty({ default: 'New Subarea' })
  subarea_name: string;

  @ApiProperty({ default: '' })
  subarea_description: string;

  @ApiProperty({ default: '' })
  subarea_summary: string;

  @ApiProperty({ default: 1 })
  category_id: number;

  @ApiProperty({ default: false })
  disabled: boolean;

  // Used as an importance metric for the subarea
  @ApiProperty({ default: 1 })
  @Min(1)
  order: number;
}
