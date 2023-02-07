import { ApiProperty } from '@nestjs/swagger';

// Data transfer object for the score of a completed assessment
export class ScoreDto {
  @ApiProperty()
  category_id?: number;

  @ApiProperty()
  maturity_id?: number;

  // The score of the assessment per category per maturity
  // Given in percentage (range: 0 - 100)
  @ApiProperty()
  score: number;
}
