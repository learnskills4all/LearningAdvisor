import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

// Data Transfer Object (DTO) for answer
// ApiProperty decorator is used to define Swagger UI properties for this class
export class AnswerDto {
  // Optional property
  @ApiProperty({ default: 1 })
  @IsNumber()
  answer_id?: number;

  // Describes the answer
  @ApiProperty({ default: 'New Answer' })
  answer_text: string;

  // Percentage of the checkpoint weight
  // Optional property
  @ApiProperty({ default: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  answer_weight?: number;

  @ApiProperty({ default: 1 })
  @IsNumber()
  template_id: number;

  @ApiProperty({ default: false })
  disabled: boolean;
}
