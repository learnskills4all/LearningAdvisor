import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

// Data Transfer Object (DTO) for maturity
// ApiProperty decorator is used to define Swagger UI properties for this class
// Default value is used for swagger UI as example values
// Min decorator is used to define the minimum value for the property
export class MaturityDto {
  @ApiProperty({ default: 1 })
  maturity_id: number;

  @ApiProperty({ default: 'New Maturity' })
  maturity_name: string;

  // Used as an importance metric for the maturity
  @ApiProperty({ default: 1 })
  @Min(1)
  order: number;

  @ApiProperty({ default: false })
  disabled: boolean;

  @ApiProperty({ default: 1 })
  template_id: number;
}
