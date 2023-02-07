import { PickType } from '@nestjs/swagger';
import { Team } from './team.dto';

/**
 * DTO for creating a new team
 */
export class InviteTokenDto extends PickType(Team, ['invite_token'] as const) {}
