import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role, Checkpoint } from '@prisma/client';
import { ErrorList } from 'src/errorTexts';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create topic
   * @param template_id template id to which topic belongs
   * @returns created topic
   * @throws Topic with this name already exists
   * @throws Template with id does not exist
   */
  async create(template_id: number) {
    return await this.prisma.topic
      .create({
        data: {
          template_id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          // Throw error ïf name and type not unique
          throw new ConflictException(ErrorList.ConflictTopic.errorMessage);
        } else if (error.code === 'P2003') {
          // Throw error if topic not found
          throw new NotFoundException(ErrorList.TopicNotFound.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });
  }

  /**
   * Find all topics in template
   * @param template_id template id
   * @returns all topics in template
   */
  async findAll(template_id: number, role: Role) {
    const data: Prisma.TopicFindManyArgs = {
      where: {
        template_id,
      },
    };

    if (role !== Role.ADMIN) {
      data.where.disabled = false;
    }

    return await this.prisma.topic.findMany(data);
  }

  /**
   * Find topic by id
   * @param topic_id topic id
   * @returns topic
   * @throws Topic with this id does not exist
   */
  async findOne(topic_id: number) {
    // Fetch topic from database
    const topic = await this.prisma.topic.findUnique({
      where: {
        topic_id,
      },
    });

    // Throw error if topic not found
    if (!topic) {
      throw new NotFoundException(ErrorList.TopicNotFound.errorMessage);
    }

    // Return topic
    return topic;
  }

  /**
   * Update topic
   * @param topic_id topic id
   * @param updateTopicDto topic data
   * @returns updated topic
   * @throws Topic with this id does not exist
   * @throws Topic with this name already exists
   */
  async update(topic_id: number, updateTopicDto: UpdateTopicDto) {
    return await this.prisma.topic
      .update({
        where: {
          topic_id,
        },
        data: {
          ...updateTopicDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          // Throw error ïf name and type not unique
          throw new ConflictException(ErrorList.ConflictTopic.errorMessage);
        } else if (error.code === 'P2025') {
          // Throw error if topic not found
          throw new NotFoundException(ErrorList.TopicNotFound.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });
  }

  /**
   * Delete topic
   * @param topic_id topic id
   * @returns deleted topic
   * @throws Topic with this id does not exist
   */
  async delete(topic_id: number) {
    return this.prisma.topic
      .delete({
        where: {
          topic_id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          // Throw error if topic not found
          throw new NotFoundException(ErrorList.TopicNotFound.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });
  }

  // Replace topics with topics in topic_ids
  async updateTopics(checkpoint: Checkpoint, topic_ids: number[]) {
    // Get topics of template
    let topics = await this.prisma.topic.findMany({
      where: {
        topic_id: {
          in: topic_ids,
        },
      },
    });

    // Get category of checkpoint
    const category = await this.prisma.category.findUnique({
      where: {
        category_id: checkpoint.category_id,
      },
    });

    // Filter topics to topics in template
    topics = topics.filter((t) => t.template_id === category.template_id);

    // Delete all current relations
    await this.prisma.checkpointInTopic.deleteMany({
      where: {
        checkpoint_id: checkpoint.checkpoint_id,
      },
    });

    // Create data for new relations
    const entries = topics.map((t) => ({
      checkpoint_id: checkpoint.checkpoint_id,
      topic_id: t.topic_id,
    }));

    // Create new relations
    await this.prisma.checkpointInTopic.createMany({
      data: entries,
    });

    // Return entries
    return entries;
  }
}
