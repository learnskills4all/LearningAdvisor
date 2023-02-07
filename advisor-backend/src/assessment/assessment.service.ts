import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AssessmentType, User } from '@prisma/client';
import { SaveService } from '../save/save.service';
import { FeedbackService } from '../feedback/feedback.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { FeedbackDto } from './dto/feedback.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { ErrorList } from 'src/errorTexts';

@Injectable()
export class AssessmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly feedbackService: FeedbackService,
    private readonly saveService: SaveService
  ) {}

  /**
   * Create assessment
   * @param createAssessmentDto Assessment data
   * @returns created assessment
   * @throws Assessment with this name and type already exists
   * @throws Team id is required for team assessment
   * @throws Team with id does not exist
   * @throws team_id is not allowed for individual assessment
   */
  async create(createAssessmentDto: CreateAssessmentDto, user: User) {
    let users = [{ user_id: user.user_id }];
    if (createAssessmentDto.assessment_type === AssessmentType.TEAM) {
      if (!createAssessmentDto.team_id) {
        throw new BadRequestException(ErrorList.BadTeamID.errorMessage);
      }

      const team = await this.prisma.team.findUnique({
        where: {
          team_id: createAssessmentDto.team_id,
        },
        include: {
          UserInTeam: true,
        },
      });

      if (!team) {
        throw new NotFoundException(ErrorList.TeamIDNotFound.errorMessage);
      }

      users = team.UserInTeam.map((user) => ({
        user_id: user.user_id,
      }));
    } else {
      if (createAssessmentDto.team_id) {
        throw new BadRequestException(ErrorList.BadTeamIDIndividual.errorMessage);
      }
    }

    const template = await this.prisma.template.findFirst({
      where: {
        template_type: createAssessmentDto.assessment_type,
        enabled: true,
        template_id: createAssessmentDto.template_id,
      },
    });

    if (!template) {
      throw new BadRequestException(ErrorList.BadActiveTemplate.errorMessage);
    }

    return await this.prisma.assessment
      .create({
        data: {
          ...createAssessmentDto,
          feedback_text: template.template_feedback,
          template_id: template.template_id,
          information: template.information,
          AssessmentParticipants: {
            create: users,
          },
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new ConflictException(ErrorList.ConflictAssessment.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });
  }

  /**
   * Find all assessments
   * @returns All assessments
   */
  async findAll() {
    return await this.prisma.assessment.findMany();
  }

  /**
   * Find individual assessments for user
   * @param user User
   * @returns Individual assessments
   */
  async findUserAssessments(user: User) {
    return await this.prisma.assessment.findMany({
      where: {
        AssessmentParticipants: {
          some: {
            user_id: user.user_id,
          },
        },
        assessment_type: AssessmentType.INDIVIDUAL,
      },
    });
  }

  /**
   * Find assessment by id
   * @param id assessment_id
   * @returns Found assessment
   * @throws Assessment not found
   */
  async findOne(id: number) {
    const assessment = await this.prisma.assessment
      .findUnique({
        where: {
          assessment_id: id,
        },
      })
      .catch((error) => {
        console.log(error);
        throw new InternalServerErrorException();
      });

    // throw NotFoundException if assessment not found
    if (!assessment) {
      throw new NotFoundException(ErrorList.AssessmentNotFound.errorMessage);
    }

    return assessment;
  }

  /**
   * Update an assessment
   * @param id assessment_id
   * @param updateAssessmentDto updated assessment data
   * @returns Updated assessment
   * @throws Assessment not found
   * @throws Assessment with this name and type already exists
   */
  async update(id: number, updateAssessmentDto: UpdateAssessmentDto) {
    return await this.prisma.assessment
      .update({
        where: {
          assessment_id: id,
        },
        data: {
          ...updateAssessmentDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException(ErrorList.AssessmentNotFound.errorMessage);
        } else if (error.code === 'P2002') {
          throw new ConflictException(ErrorList.ConflictAssessment.errorMessage);
        } else {
          console.log(error);
          throw new InternalServerErrorException();
        }
      });
  }

  /**
   * Delete an assessment
   * @param id assessment_id
   * @returns deleted assessment
   * @throws Assessment not found
   */
  async delete(id: number) {
    const deleteAssessment = this.prisma.assessment
      .delete({
        where: {
          assessment_id: id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException(ErrorList.AssessmentNotFound.errorMessage);
        } else {
          console.log(error);
          throw new InternalServerErrorException();
        }
      });

    const deleteParticipants = this.prisma.assessmentParticipants.deleteMany({
      where: {
        assessment_id: id,
      },
    });

    await Promise.all([deleteAssessment, deleteParticipants]);

    return deleteAssessment;
  }

  /**
   * Mark assessment as completed
   * @param id assessment_id
   * @returns updated assessment
   * @throws Assessment not found
   */
  async complete(id: number) {
    const assessment = await this.prisma.assessment.findUnique({
      where: {
        assessment_id: id,
      },
    });

    if (!assessment) {
      throw new NotFoundException(ErrorList.AssessmentNotFound.errorMessage);
    }

    const areAllCheckpointsFilled = await this.saveService.areAllAnswersFilled(
      assessment
    );

    if (!areAllCheckpointsFilled) {
      throw new BadRequestException(ErrorList.BadFillCheckpoint.errorMessage);
    }

    await this.feedbackService.saveRecommendations(assessment);

    return await this.prisma.assessment
      .update({
        where: {
          assessment_id: id,
        },
        data: {
          completed_at: new Date(),
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException(ErrorList.AssessmentNotFound.errorMessage);
        } else {
          console.log(error);
          throw new InternalServerErrorException();
        }
      });
  }

  /**
   * Check if user is part of assessment
   * @param assessment_id assessment_id
   * @param user user
   * @returns assessment if member, null otherwise
   */
  async userInAssessment(assessment_id: number, user: User) {
    const assessment = await this.prisma.assessment.findUnique({
      where: {
        assessment_id,
      },
      include: {
        AssessmentParticipants: true,
      },
    });

    if (!assessment) {
      return null;
    }

    const userInAssessment = assessment.AssessmentParticipants.find(
      (participant) => {
        return participant.user_id === user.user_id;
      }
    );

    if (!userInAssessment) {
      if (assessment.assessment_type === AssessmentType.INDIVIDUAL) {
        return null;
      }

      const isInTeam = await this.prisma.team.findMany({
        where: {
          team_id: assessment.team_id,
          UserInTeam: {
            some: {
              user_id: user.user_id,
            },
          },
        },
      });

      if (isInTeam) {
        return assessment;
      }

      return null;
    }

    return assessment;
  }

  /**
   * Add feedback to assessment
   * @param assessment_id assessment_id
   * @param feedbackDto feedback data
   * @returns updated assessment
   * @throws Assessment not found
   */
  async feedback(assessment_id: number, { feedback_text }: FeedbackDto) {
    return await this.prisma.assessment
      .update({
        where: {
          assessment_id,
        },
        data: {
          feedback_text,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException(ErrorList.AssessmentNotFound.errorMessage);
        } else {
          console.log(error);
          throw new InternalServerErrorException();
        }
      });
  }
}
