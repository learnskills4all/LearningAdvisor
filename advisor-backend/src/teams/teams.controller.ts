import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Delete,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  Patch,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Team } from './dto/team.dto';
import { TeamMembers } from './dto/team-member.dto';
import { InviteTokenDto } from './dto/invite-token.dto';
import { AssessmentDto } from '../assessment/dto/assessment.dto';
import { Role, User } from '@prisma/client';
import AuthUser from '../common/decorators/auth-user.decorator';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  /**
   * [GET] /teams/my-teams - get the teams of the user issuing the request
   * @returns array of team object
   * @throws {NotFoundException} if user is not in any team
   * @throws {NotFoundException} team with given team id not found
   * @throws {InternalServerErrorException} internal server error
   */
  @Get('/my-teams/')
  @ApiResponse({ description: 'Get ', type: Team })
  @ApiNotFoundResponse({ description: 'user is not in any team' })
  @ApiInternalServerErrorResponse({ description: 'internal server error' })
  getTeams(@AuthUser() user: User): Promise<Team[]> {
    return this.teamsService.getTeams(user.user_id);
  }

  /**
   * [GET] /team/:team_id/members - Get members of a team given a team id
   * Permission: ADMIN, ASSESSOR (if is part of the team),
   *             USER (if is part of the team)
   * @param team_id team_id
   * @returns Team members object
   */
  @Get(':team_id/members')
  @ApiResponse({
    description: 'Get members of a team given a team id',
    type: TeamMembers,
  })
  @ApiNotFoundResponse({ description: 'Team with given team id not found' })
  @ApiNotFoundResponse({ description: 'No members are associated to the team' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findTeamMembers(
    @AuthUser() user: User,
    @Param('team_id', ParseIntPipe) team_id: number
  ): Promise<TeamMembers> {
    const isUserInTeam = await this.teamsService
      .isUserInTeam(user.user_id, team_id)
      .catch((error) => {
        if (error instanceof NotFoundException) {
          // Throw error if team with given team id not found
          throw new NotFoundException('Team with given team id not found');
        } else {
          // Throw error if internal server error
          console.log(error);
          throw new InternalServerErrorException();
        }
      });
    if (!isUserInTeam && user.role !== 'ADMIN') {
      // Throw error if user is not in team
      throw new ForbiddenException('You are not part of this team');
    }

    return this.teamsService.findTeamMembers(team_id);
  }

  /**
   * [PATCH] /team/join/:invite_token - Join team via invite_token
   * @param invite_token invite_token
   * @returns Udated team members object
   */
  @Patch('join/:invite_token')
  @ApiResponse({
    description: 'Join team via invite_token',
    type: TeamMembers,
  })
  @ApiNotFoundResponse({
    description: 'Team with given invite_token not found',
  })
  @ApiNotFoundResponse({ description: 'No members are associated to the team' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  addTeamMember(
    @AuthUser() user: User,
    @Param('invite_token', ParseUUIDPipe) invite_token: string
  ): Promise<TeamMembers> {
    return this.teamsService.addTeamMember(user, invite_token);
  }

  /**
   * [GET] /team/:team_id/invite_token - Get invite token for a team
   * @param team_id team_id
   * @returns invite_token
   * @throws Team not found
   */
  @Get(':team_id/invite_token')
  @ApiResponse({
    description: 'Get invite token of a team',
    type: String,
  })
  @ApiNotFoundResponse({ description: 'Team with given team id not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getInviteToken(
    @AuthUser() user: User,
    @Param('team_id', ParseIntPipe) team_id: number
  ): Promise<InviteTokenDto> {
    const isUserInTeam = await this.teamsService
      .isUserInTeam(user.user_id, team_id)
      .catch((error) => {
        if (error instanceof NotFoundException) {
          // Throw error if team with given team id not found
          throw new NotFoundException('Team with given team id not found');
        } else {
          // Throw error if internal server error
          console.log(error);
          throw new InternalServerErrorException();
        }
      });
    if (!isUserInTeam && user.role !== 'ADMIN') {
      // Throw error if user is not in team
      throw new ForbiddenException('You are not part of this team');
    }

    return this.teamsService.getInviteToken(team_id);
  }

  /**
   * [GET] /team/:team_id/assessments - Get assessments of a team given a team id
   * @param id team_id
   * @returns assessments
   * @throws Team not found
   */
  @Get(':team_id/assessments')
  @ApiResponse({
    description: 'Get assessments of a team given a team id',
    type: AssessmentDto,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Team with given team id not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async getTeamAssessments(
    @AuthUser() user: User,
    @Param('team_id', ParseIntPipe) team_id: number
  ): Promise<AssessmentDto[]> {
    const isUserInTeam = await this.teamsService
      .isUserInTeam(user.user_id, team_id)
      .catch((error) => {
        if (error instanceof NotFoundException) {
          // Throw error if team with given team id not found
          throw new NotFoundException('Team with given team id not found');
        } else {
          // Throw error if internal server error
          console.log(error);
          throw new InternalServerErrorException();
        }
      });
    if (!isUserInTeam && user.role !== 'ADMIN') {
      // Throw error if user is not in team
      throw new ForbiddenException('You are not part of this team');
    }

    return this.teamsService.getAssessments(team_id);
  }

  /**
   * [DELETE] /team/:team_id/member/:user_id - Delete team member given a team_id and a user_id
   * Allowed roles: ADMIN, ASSESSOR (if is part of the team)
   * @param team_id team_id
   * @param user_id user_id
   * @returns the updated team member object
   * @throws NotFoundException if team member not found
   * @throws NotFoundException if Team with given team id not found or no
   *            members are associated to the team
   * @throws InternalServerErrorException
   */
  @Delete(':team_id/member/:user_id')
  @ApiResponse({
    description: 'Remove team member given a team_id and a user_id',
    type: TeamMembers,
  })
  @ApiNotFoundResponse({
    description: 'Team member with given user id not found',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async deleteTeamMember(
    @AuthUser() user: User,
    @Param('team_id', ParseIntPipe) team_id: number,
    @Param('user_id', ParseIntPipe) user_id: number
  ): Promise<TeamMembers> {
    if (user.role === Role.USER && user.user_id !== user_id) {
      throw new ForbiddenException();
    }

    const isUserInTeam = await this.teamsService
      .isUserInTeam(user.user_id, team_id)
      .catch((error) => {
        if (error instanceof NotFoundException) {
          // Throw error if team with given team id not found
          throw new NotFoundException('Team with given team id not found');
        } else {
          // Throw error if internal server error
          console.log(error);
          throw new InternalServerErrorException();
        }
      });
    if (!isUserInTeam && user.role !== 'ADMIN') {
      // Throw error if user is not in team
      throw new ForbiddenException('You are not part of this team');
    }

    return this.teamsService.removeTeamMember(team_id, user_id);
  }
}
