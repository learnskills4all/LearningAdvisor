import { OmitType, PartialType } from '@nestjs/swagger';
import { Team } from './team.dto';

// Data transfer object for updating a team
// OmitType removes the listed propoerties from the given object
// PartialType makes the listed properties optional
export class UpdateTeamDto extends PartialType(
  OmitType(Team, ['team_id', 'invite_token'] as const)
) {}
