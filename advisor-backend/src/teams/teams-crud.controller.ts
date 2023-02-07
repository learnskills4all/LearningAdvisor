import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import AuthUser from '../common/decorators/auth-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Team } from './dto/team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsCRUDService } from './teams-crud.service';
import { TeamsService } from './teams.service';

@ApiTags('teams')
@Controller('teams')
export class TeamsCRUDController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly teamsCRUDService: TeamsCRUDService
  ) {}

  /**
   * [POST] /team/create - Create team with default team_name - "New Team",
   *    team_country - "", team_department - ""
   * Allowed roles: ADMIN, ASSESSOR
   * @returns Team object
   */
  @Post('create')
  @ApiResponse({
    description:
      'Create team with default team_name - "New Team", team_country - "", team_department - ""',
    type: Team,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.ASSESSOR)
  create(@AuthUser() user: User): Promise<Team> {
    return this.teamsCRUDService.create(user.user_id);
  }

  /**
   * [GET] /team/:team_id - Get team by team id
   * @param team_id team_id
   * @returns Team object
   */
  @UseGuards(AuthGuard('jwt'))
  @Get(':team_id')
  @ApiResponse({
    description: 'Find team by team id',
    type: Team,
  })
  @ApiNotFoundResponse({ description: 'Team with given team id not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async findOne(
    @AuthUser() user: User,
    @Param('team_id', ParseIntPipe) team_id: number
  ): Promise<Team> {
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

    return this.teamsCRUDService.findOne(team_id);
  }

  /**
   * [PATCH] /team/:team_id - Update team given a team_id and an updateTeamDto
   * Allowed roles: ADMIN, ASSESSOR
   * @param team_id team_id
   * @param updateTeamDto UpdateTeamDto
   * @returns an updated team object
   * @throws Team not found
   * @throws Internal server error
   */
  @Patch(':team_id')
  @ApiResponse({
    description: 'Update team given a team_id and an updateTeamDto',
    type: Team,
  })
  @ApiNotFoundResponse({ description: 'Team with given team id not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.ASSESSOR)
  async updateTeam(
    @AuthUser() user: User,
    @Param('team_id', ParseIntPipe) team_id: number,
    @Body() updateTeamDto: UpdateTeamDto
  ): Promise<Team> {
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

    return this.teamsCRUDService.updateTeam(team_id, updateTeamDto);
  }

  /**
   * [DELETE] /team/:team_id - Delete team given a team_id
   * Allowed roles: ADMIN, ASSESSOR (if is part of the team)
   * @param team_id team_id
   * @returns the deleted team object
   * @throws Team not found
   * @throws Internal server error
   * @throws assessor is not part of the team
   */
  @Delete(':team_id')
  @ApiNotFoundResponse({ description: 'Team with given team id not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiResponse({
    description: 'Delete team given a team_id',
    type: Team,
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.ASSESSOR)
  async deleteTeam(
    @AuthUser() user: User,
    @Param('team_id', ParseIntPipe) team_id: number
  ): Promise<Team> {
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

    return this.teamsCRUDService.deleteTeam(team_id);
  }
}
