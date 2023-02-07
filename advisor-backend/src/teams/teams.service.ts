import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Team } from './dto/team.dto';
import { TeamMembers } from './dto/team-member.dto';
import { AssessmentDto } from '../assessment/dto/assessment.dto';
import { User } from '@prisma/client';
import { InviteTokenDto } from './dto/invite-token.dto';
import { ErrorList } from 'src/errorTexts';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get team members object given a team id
   * @param id id of team
   * @param user user that is issuing the request
   * @returns team members object corresponding to team_id
   * @throws Team not found
   */
  async findTeamMembers(id: number): Promise<TeamMembers> {
    // Get team name and associated user ids from team with team_id from prisma
    const temp = await this.prisma.team.findUnique({
      where: {
        team_id: id,
      },
      select: {
        team_name: true,
        UserInTeam: {
          select: {
            user_id: true,
          },
        },
      },
    });

    if (!temp) {
      // Throw error if team with given team id not found
      throw new NotFoundException(ErrorList.TeamIDNotFound.errorMessage);
      //throw new NotFoundException(`Team with id ${createAssessmentDto.team_id} not found`)
    }

    const teamMemberIds = temp.UserInTeam.map((a) => a.user_id);

    if (teamMemberIds.length === 0) {
      return { team_members: [] };
    }

    // Get team member information from team with team_member_ids from prisma
    const teamMembers = await this.prisma.user.findMany({
      where: {
        user_id: {
          in: teamMemberIds,
        },
      },
      select: {
        user_id: true,
        username: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    // Return team
    return { team_members: teamMembers };
  }

  /**
   * Add team member to team with invite_token
   * @param invite_token invite token
   * @param user user that is issuing the request
   * @returns team members object corresponding, given invite_token
   * @throws Team not found
   */
  async addTeamMember(user: User, invite_token: string): Promise<TeamMembers> {
    // Get team id, team name and associated user ids from team with invite_token from prisma
    const temp = await this.prisma.team.findUnique({
      where: {
        invite_token: invite_token,
      },
      select: {
        team_id: true,
      },
    });

    if (!temp) {
      // Throw error if team with given invite token not found
      throw new NotFoundException(ErrorList.TeamTokenNotFound.errorMessage);
    }

    await this.prisma.userInTeam
      .create({
        data: {
          user_id: user.user_id,
          team_id: temp.team_id,
        },
      })
      .catch((error) => {
        console.log(error);
        if (error.code === 'P2002') {
          throw new ConflictException(ErrorList.ConflictUserInTeam.errorMessage);
        } else {
          throw new InternalServerErrorException();
        }
      });

    return await this.findTeamMembers(temp.team_id).catch((error) => {
      console.log(error);
      throw new InternalServerErrorException();
    });
  }

  /**
   * Get assessments of a team given a team id
   * @param id id of team
   * @returns assessment objects corresponding to team_id
   * @throws Team not found
   */
  async getAssessments(id: number): Promise<AssessmentDto[]> {
    const assessments = await this.prisma.team.findUnique({
      where: {
        team_id: id,
      },
      select: {
        Assessment: true,
      },
    });

    if (!assessments) {
      // Throw error if team with given team id not found
      throw new NotFoundException(ErrorList.TeamNotFound.errorMessage);
    }

    return assessments.Assessment;
  }

  /**
   * Check whether user is in team given a user id and a unique team identifier
   * @param id id of the user
   * @param team_id id of the team
   * @returns true if user is in team, false otherwise
   * @throws Team with given team id not found
   */
  async isUserInTeam(id: number, team_id: number): Promise<boolean> {
    // Get team id and associated user ids from team with team_id from prisma
    const team = await this.prisma.team.findUnique({
      where: {
        team_id,
      },
      select: {
        team_id: true,
        UserInTeam: {
          select: {
            user_id: true,
          },
        },
      },
    });

    if (!team) {
      // Throw error if team with given team id not found
      throw new NotFoundException(ErrorList.TeamNotFound.errorMessage);
    }

    // Return true if user is in team, false otherwise
    return team.UserInTeam.some((a) => a.user_id === id);
  }

  /**
   * Get team objects of the user issuing the request
   * @param user_id user_id of user issuing the request
   * @returns teams objects of the user issuing the request
   * @throws User is not associated to any teams
   * @throws Team with given team id not found
   */
  async getTeams(user_id: number): Promise<Team[]> {
    return await this.prisma.team.findMany({
      where: {
        UserInTeam: {
          some: {
            user_id,
          },
        },
      },
    });
  }

  /**
   * Get invite_token of team given a team id
   * @param id id of team
   * @returns inviteTokenDto object corresponding to team_id
   * @throws Team not found
   */
  async getInviteToken(id: number): Promise<InviteTokenDto> {
    // Get team id and associated user ids from team with team_id from prisma
    const invite_token = await this.prisma.team.findUnique({
      where: {
        team_id: id,
      },
      select: {
        invite_token: true,
      },
    });

    if (!invite_token) {
      // Throw error if team with given team id not found
      throw new NotFoundException(ErrorList.TeamNotFound.errorMessage);
    }

    return {
      invite_token: invite_token.invite_token,
    } as InviteTokenDto;
  }

  /**
   * Remove team member given a team id and a user id
   * @param team_id id of team
   * @param user_id id of user to be deleted
   * @returns updated team member object
   * @throws NotFoundException if team member not found
   * @throws NotFoundException if Team with given team id not found or no
   *            members are associated to the team
   * @throws InternalServerErrorException
   */
  async removeTeamMember(
    team_id: number,
    user_id: number
  ): Promise<TeamMembers> {
    await this.prisma.userInTeam
      .delete({
        where: {
          user_id_team_id: {
            user_id,
            team_id,
          },
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException(ErrorList.TeamMemberNotFound.errorMessage);
        } else {
          console.log(error);
          throw new InternalServerErrorException();
        }
      });

    return await this.findTeamMembers(team_id).catch((error) => {
      console.log(error);
      throw new InternalServerErrorException();
    });
  }
}
