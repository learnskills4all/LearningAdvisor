import { PartialType, OmitType } from '@nestjs/swagger';
import { CheckpointDto } from './checkpoint.dto';

// Data Transfer Object (DTO) for updating a checkpoint
// OmitType ommits the listed properties from the given object
// PartialType makes the listed properties optional
export class UpdateCheckpointDto extends PartialType(
  OmitType(CheckpointDto, ['checkpoint_id', 'category_id'] as const)
) {}
