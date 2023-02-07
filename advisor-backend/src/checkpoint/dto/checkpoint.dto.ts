import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

// Data Transfer Object (DTO) for checkpoint
// ApiProperty decorator is used to define Swagger UI properties for this class
// Default value is used for swagger UI as example values
// Min decorator is used to define the minimum value for the property
export class CheckpointDto {
  @ApiProperty({ default: 1 })
  checkpoint_id: number;

  @ApiProperty({ default: 'New Checkpoint' })
  checkpoint_description: string;

  @ApiProperty({ default: '' })
  checkpoint_additional_information: string;

  // Range of weight values are given by the weight_range_min and
  //   weight_range_max properties in the template
  @ApiProperty({ default: 3 })
  weight: number;

  // Used as an importance metric for the checkpoint
  @ApiProperty({ default: 1 })
  @Min(1)
  order: number;

  @ApiProperty({ default: false })
  disabled: boolean;

  @ApiProperty({ default: 1 })
  maturity_id: number;

  @ApiProperty({ default: 1 })
  category_id: number;

  @ApiProperty({ default: [1] })
  topics: number[];
}
