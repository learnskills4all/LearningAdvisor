import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

// Data Transfer Object (DTO) for category
// ApiProperty decorator is used to define Swagger UI properties for this class
// Default value is used for swagger UI as example values
// Min decorator is used to define the minimum value for the property
export class CategoryDto {
  @ApiProperty({ default: 1 })
  category_id: number;

  @ApiProperty({ default: 'New Category' })
  category_name: string;

  @ApiProperty({ default: '#FF0000' })
  color: string;

  // Used as an importance metric for the category
  @ApiProperty({ default: 1 })
  @Min(1)
  order: number;

  @ApiProperty({ default: false })
  disabled: boolean;

  @ApiProperty({ default: 1 })
  template_id: number;
}
