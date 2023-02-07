import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

// Data Transfer Object (DTO) for saving a checkpoint
// ApiProperty decorator is used to define Swagger UI properties for this class
// Default value is used for swagger UI as example values
// Min decorator is used to define the minimum value for the property
export class SaveCheckpointDto {
  @ApiProperty({ default: 1 })
  @IsNumber()
  @Min(1)
  checkpoint_id: number;

  @ApiProperty({ default: 1 })
  answer_id: number;
}
