import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Assessment, CheckpointAndAnswersInAssessments } from '@prisma/client';
import { ErrorList } from 'src/errorTexts';
import { AssessmentDto } from '../assessment/dto/assessment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SaveService } from '../save/save.service';
import { RecommendationDto } from './dto/recommendation.dto';
import { UpdateRecommendationDto } from './dto/UpdateRecommendation.dto';

export interface ISort {
  data: RecommendationDto;
  answerWeight: number;
  maturityOrder: number;
  categoryOrder: number;
  checkpointWeight: number;
}

@Injectable()
export class FeedbackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly saveService: SaveService
  ) {}

  async updateRecommendation(
    feedback_id: number,
    updateRecommendationDto: UpdateRecommendationDto
  ) {
    const feedback = await this.prisma.feedback.findUnique({
      where: {
        feedback_id,
      },
    });

    if (!feedback) {
      throw new NotFoundException(ErrorList.FeedbackNotFound.errorMessage);
    }

    const newOrder = updateRecommendationDto.order;
    // Check if new order is valid
    if (newOrder) {
      const maxOrder = await this.prisma.feedback.count({
        where: {
          assessment_id: feedback.assessment_id,
        },
      });

      if (newOrder > maxOrder) {
        throw new BadRequestException(ErrorList.BadOrder.errorMessage);
        //throw new BadRequestException( `Order of ${newOrder} is too high, maximum order is ${maxOrder}`)
      }
    }

    const updatedFeedback = await this.prisma.feedback.update({
      where: {
        feedback_id,
      },
      data: {
        ...updateRecommendationDto,
      },
    });

    if (newOrder) {
      // If neworder is lower than current order, increment all orders inbetween by 1
      if (newOrder < feedback.order) {
        await this.prisma.feedback.updateMany({
          where: {
            assessment_id: feedback.assessment_id,
            order: {
              gte: newOrder,
              lte: feedback.order,
            },
            feedback_id: {
              not: feedback_id,
            },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        });
      }
      // If neworder is higher than current order, decrement all orders inbetween by 1
      else if (newOrder > feedback.order) {
        await this.prisma.feedback.updateMany({
          where: {
            assessment_id: feedback.assessment_id,
            order: {
              gte: feedback.order,
              lte: newOrder,
            },
            feedback_id: {
              not: feedback_id,
            },
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        });
      }

      return updatedFeedback;
    }
  }

  async getRecommendations(assessment: Assessment, topic_id?: number) {
    let recommendations: RecommendationDto[] = [];
    if (!assessment.completed_at) {
      recommendations = await this.calculateRecommendations(assessment);
    } else {
      recommendations = await this.prisma.feedback.findMany({
        where: {
          assessment_id: assessment.assessment_id,
        },
        select: {
          feedback_id: true,
          feedback_text: true,
          feedback_additional_information: true,
          order: true,
          topic_ids: true,
        },
        orderBy: {
          order: 'asc',
        },
      });
    }

    if (topic_id) {
      recommendations.sort(this.compareTopic(topic_id));
      for (let i = 0; i < recommendations.length; i++) {
        recommendations[i].order = i + 1;
        delete recommendations[i].topic_ids;
      }
    }

    return recommendations;
  }

  async saveRecommendations(assessment: Assessment) {
    const recommendations = await this.calculateRecommendations(assessment);
    await this.prisma.feedback.createMany({
      data: recommendations.map((recommendation) => {
        return {
          assessment_id: assessment.assessment_id,
          ...(recommendation as any),
        };
      }),
    });
  }

  async calculateRecommendations({ assessment_id, template_id }: Assessment) {
    // Get all saved answers for this assessment
    let answeredCheckpoints = await this.saveService.getSavedCheckpoints({
      assessment_id,
      template_id,
    } as AssessmentDto);

    // Get all checkpoint ids of the saved answers
    const checkpoints = await this.getCheckpointsObject(answeredCheckpoints);

    // Get all answer ids of the saved answers
    const answers = await this.getAnswersObject(answeredCheckpoints);

    answeredCheckpoints = answeredCheckpoints.filter(
      (saved) => answers[saved.answer_id]
    );

    // Map answered objective to object for sorting and returning
    const list: ISort[] = answeredCheckpoints
      .map((saved) => {
        const checkpoint = checkpoints[saved.checkpoint_id];
        const topic_ids = checkpoint.CheckpointInTopic.map(
          (checkpointInTopic) => checkpointInTopic.topic_id
        );
        const checkpointWeight = checkpoint.weight;
        const answerWeight = answers[saved.answer_id].answer_weight;
        const maturityOrder = checkpoint.Maturity.order;
        const categoryOrder = checkpoint.Category.category_order;
        return {
          data: {
            feedback_text: checkpoint.checkpoint_description,
            feedback_additional_information:
              checkpoint.checkpoint_additional_information,
            topic_ids,
          },
          answerWeight,
          maturityOrder,
          categoryOrder,
          checkpointWeight,
        };
      })
      // Filter out checkpoints that are fully completed
      .filter((item) => item.answerWeight >= 0 && item.answerWeight < 100);

    // Sort answer by maturity order, answer score, category order, and weight
    list.sort(this.compareMaturity.bind(this));

    // Return data as list of recommendations
    return list.map((item, index) => {
      return {
        ...item.data,
        order: ++index,
      } as RecommendationDto;
    });
  }

  /**
   * Get all answers of the answered checkpoint as object
   * @param answeredCheckpoints List of answered checkpoints
   * @returns Object with answer_id as key and answer as value
   */
  private async getAnswersObject(
    answeredCheckpoints: CheckpointAndAnswersInAssessments[]
  ) {
    const answerIds = answeredCheckpoints
      .map((checkpoint) => checkpoint.answer_id)
      .filter((answer_id) => answer_id);

    const answersList = await this.prisma.answer.findMany({
      where: {
        answer_id: {
          in: answerIds,
        },
      },
    });

    const answers = {};
    answersList.forEach((answer) => {
      if (answer.answer_id) {
        answers[answer.answer_id] = answer;
      }
    });
    return answers;
  }

  /**
   * Get all checkpoints of the answered checkpoint as object
   * @param answeredCheckpoints List of answered checkpoints
   * @param topic_id Topic id to get checkpoint of
   * @returns Object with checkpoint_id as key and checkpoint as value
   */
  private async getCheckpointsObject(
    answeredCheckpoints: CheckpointAndAnswersInAssessments[]
  ) {
    const checkpointIds = answeredCheckpoints.map(
      (checkpoint) => checkpoint.checkpoint_id
    );

    const checkpointsList = await this.prisma.checkpoint.findMany({
      where: {
        checkpoint_id: {
          in: checkpointIds,
        },
      },
      include: {
        Category: true,
        Maturity: true,
        CheckpointInTopic: true,
      },
    });

    const checkpoints = {};
    checkpointsList.forEach((checkpoint) => {
      checkpoints[checkpoint.checkpoint_id] = checkpoint;
    });
    return checkpoints;
  }

  /**
   * Function which creates compare topic, prioritise topic_id
   * @param a Sort object
   * @param b Sort object
   * @returns -1 if topic id is found in a, 0 if equal and 1 if topic id is found in b
   */
  compareTopic(topic_id: number) {
    return function (a: RecommendationDto, b: RecommendationDto) {
      if (a.topic_ids.includes(topic_id)) {
        if (b.topic_ids.includes(topic_id)) {
          return 0;
        }
        return -1;
      }
      if (b.topic_ids.includes(topic_id)) {
        return 1;
      }
      return 0;
    };
  }

  /**
   * Compare maturity order
   * @param a Sort object
   * @param b Sort object
   * @returns compare by answer weight if equal, otherwise difference of maturity order
   */
  compareMaturity(a: ISort, b: ISort) {
    if (a.maturityOrder === b.maturityOrder) {
      return this.compareAnswerWeight(a, b);
    }
    return a.maturityOrder - b.maturityOrder;
  }

  /**
   * Compare answer score
   * @param a Answer object
   * @param b Answer object
   * @returns compare by category order if equal, otherwise difference of score
   */
  compareAnswerWeight(a: ISort, b: ISort) {
    if (a.answerWeight === b.answerWeight) {
      return this.compareCategoryOrder(a, b);
    }
    return a.answerWeight - b.answerWeight;
  }

  /**
   * Compare category order
   * @param a Answer object
   * @param b Answer object
   * @returns compare by checkpoint weight if equal, otherwise difference of category order
   */
  compareCategoryOrder(a: ISort, b: ISort) {
    if (a.categoryOrder === b.categoryOrder) {
      return this.compareWeight(a, b);
    }
    return a.categoryOrder - b.categoryOrder;
  }

  /**
   * Compare checkpoint weight in reverse order
   * @param a Answer object
   * @param b Answer object
   * @returns 0 if equal, otherwise difference of weight
   */
  compareWeight(a: ISort, b: ISort) {
    if (a.checkpointWeight === b.checkpointWeight) {
      return 0;
    }
    return b.checkpointWeight - a.checkpointWeight;
  }
}
