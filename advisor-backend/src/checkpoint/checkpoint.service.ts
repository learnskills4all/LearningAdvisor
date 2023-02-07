import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TemplateService } from '../template/template.service';
import { TopicService } from '../topic/topic.service';
import { Prisma, Role } from '@prisma/client';
import { ErrorList } from 'src/errorTexts';

@Injectable()
export class CheckpointService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly templateService: TemplateService,
    private readonly topicService: TopicService
  ) {}

  formatTopics(checkpoint: any) {
    console.log(checkpoint);
    checkpoint.topics = checkpoint.CheckpointInTopic.map((c) => c.topic_id);
    delete checkpoint.CheckpointInTopic;
    return checkpoint;
  }

  /**
   * Create checkpoint
   * @param category_id category id to which checkpoint belongs
   * @param createcheckpointDto checkpoint data
   * @returns created checkpoint
   * @throws checkpoint with this name already exists
   * @throws category with id does not exist
   */
  async create(category_id: number) {
    const order = await this.prisma.checkpoint.count({
      where: {
        category_id,
      },
    });

    const category = await this.prisma.category.findUnique({
      where: {
        category_id,
      },
      include: {
        Template: true,
      },
    });

    if (!category) {
      throw new NotFoundException(ErrorList.CategoryNotFound.errorMessage);
    }

    const maturity = await this.prisma.maturity.findFirst({
      where: {
        template_id: category.template_id,
        disabled: false,
      },
    });

    let weight = 3;

    const isInRange = await this.templateService.checkWeightRange(
      category.template_id,
      weight
    );

    if (!isInRange) {
      weight = category.Template.weight_range_min;
    }

    if (!maturity) {
      throw new NotFoundException(ErrorList.MaturityNotFound.errorMessage);
    }

    const createdCheckpoint = await this.prisma.checkpoint
      .create({
        data: {
          Category: {
            connect: {
              category_id,
            },
          },
          Maturity: {
            connect: {
              maturity_id: maturity.maturity_id,
            },
          },
          order: order + 1,
          weight,
        },
        include: {
          CheckpointInTopic: true,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          // Throw error ïf name and type not unique
          throw new ConflictException(ErrorList.ConflictCheckpointDescription.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });
    return this.formatTopics(createdCheckpoint);
  }

  /**
   * Find all checkpoints in category
   * @param category_id category id
   * @returns all checkpoints in category
   */
  async findAll(category_id: number, role: Role) {
    const where: Prisma.CheckpointWhereInput = {
      category_id,
    };

    if (role !== Role.ADMIN) {
      where.Maturity = {
        disabled: false,
      };
      where.disabled = false;
    }

    const data: Prisma.CheckpointFindManyArgs = {
      where,
      include: {
        CheckpointInTopic: true,
      },
    };

    const checkpoints = await this.prisma.checkpoint.findMany(data);

    return checkpoints.map((c) => this.formatTopics(c));
  }

  /**
   * Get checkpoint by id
   * @param checkpoint checkpoint id
   * @returns the checkpoint object
   * @throws Checkpoint not found
   */
  async findOne(checkpoint_id: number) {
    // Get checkpoint by id from prisma
    const checkpoint: any = await this.prisma.checkpoint.findUnique({
      where: {
        checkpoint_id,
      },
      include: {
        CheckpointInTopic: true,
      },
    });

    // Throw NotFoundException if checkpoint not found
    if (!checkpoint) {
      throw new NotFoundException(ErrorList.CheckpointNotFound.errorMessage);
    }

    return this.formatTopics(checkpoint);
  }

  /**
   * Update checkpoint
   * @param checkpoint_id checkpoint id
   * @param updateCheckpointDto checkpoint data
   * @returns updated checkpoint
   */
  async update(
    checkpoint_id: number,
    updateCheckpointDto: UpdateCheckpointDto
  ) {
    let topics;
    if (updateCheckpointDto.topics) {
      topics = [...updateCheckpointDto.topics];
      delete updateCheckpointDto.topics;
    }

    // Get checkpoint by id from prisma
    const checkpoint = await this.prisma.checkpoint.findUnique({
      where: {
        checkpoint_id,
      },
      include: {
        Category: true,
      },
    });

    // Throw NotFoundException if checkpointnot found
    if (!checkpoint) {
      throw new NotFoundException(ErrorList.CheckpointNotFound.errorMessage);
    }

    // Check if maturity exists if maturity_id is set
    if (updateCheckpointDto.maturity_id) {
      const maturity = await this.prisma.maturity.findUnique({
        where: {
          maturity_id: updateCheckpointDto.maturity_id,
        },
      });

      // Throw NotFoundException if maturity not found
      if (!maturity) {
        throw new NotFoundException(ErrorList.MaturityNotFound.errorMessage);
      }
    }

    // Check if weight is valid
    const isWeightCorrect = await this.templateService
      .checkWeightRange(
        checkpoint.Category.template_id,
        updateCheckpointDto.weight
      )
      .catch((error) => {
        throw new BadRequestException(error.message);
      });

    if (!isWeightCorrect) {
      throw new BadRequestException(ErrorList.BadWeightRange.errorMessage);
    }

    const newOrder = updateCheckpointDto.order;

    // Update orders if order changed
    if (newOrder) {
      // Check if order is valid (not more than number of categories in template)
      const order = await this.prisma.checkpoint.count({
        where: {
          category_id: checkpoint.category_id,
        },
      });

      if (updateCheckpointDto.order > order) {
        throw new BadRequestException(ErrorList.BadOrderCategory.errorMessage);
      }
    }

    const updateData: any = {
      where: {
        checkpoint_id,
      },
      data: updateCheckpointDto,
      include: {
        CheckpointInTopic: true,
      },
    };

    // Update checkpoint
    const updatedCheckpoint: any = await this.prisma.checkpoint
      .update(updateData)
      .catch((error) => {
        if (error.code === 'P2002') {
          // Throw error ïf name not unique
          throw new ConflictException(ErrorList.ConflictCheckpointName.errorMessage);
        } else if (error.code === 'P2025') {
          // Throw error if category not found
          throw new NotFoundException(ErrorList.CategoryNotFound.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });

    // If new order is smaller than old order, increase order of all categories with between new and old order
    if (newOrder && newOrder < checkpoint.order) {
      await this.prisma.checkpoint.updateMany({
        where: {
          category_id: checkpoint.category_id,
          checkpoint_id: {
            not: checkpoint.checkpoint_id,
          },
          order: {
            gte: updateCheckpointDto.order,
            lte: checkpoint.order,
          },
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });
    } else if (newOrder && newOrder > checkpoint.order) {
      // If new order is bigger than old order, decrease order of all categories with between old and new order
      await this.prisma.checkpoint.updateMany({
        where: {
          category_id: checkpoint.category_id,
          checkpoint_id: {
            not: checkpoint.checkpoint_id,
          },
          order: {
            gte: checkpoint.order,
            lte: updateCheckpointDto.order,
          },
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });
    }

    // Update relations of topics if specified
    if (topics) {
      const newTopics = await this.topicService.updateTopics(
        updatedCheckpoint,
        topics
      );
      updatedCheckpoint.CheckpointInTopic = newTopics;
    }

    return this.formatTopics(updatedCheckpoint);
  }

  /**
   * Delete checkpoint
   * @param checkpoint_id checkpoint id
   * @returns deleted checkpoint
   * @throws checkpoint not found
   */
  async delete(checkpoint_id: number) {
    // Delete checkpoint
    const deletedCheckpoint = await this.prisma.checkpoint
      .delete({
        where: {
          checkpoint_id,
        },
        include: {
          CheckpointInTopic: true,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          // Throw error if checkpoint not found
          throw new NotFoundException(ErrorList.CheckpointNotFound.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });

    // Decrement order of all categories with order bigger than deleted checkpoint
    await this.prisma.checkpoint.updateMany({
      where: {
        category_id: deletedCheckpoint.category_id,
        order: {
          gte: deletedCheckpoint.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });

    await this.prisma.checkpointInTopic.deleteMany({
      where: {
        checkpoint_id,
      },
    });

    return this.formatTopics(deletedCheckpoint);
  }
}
