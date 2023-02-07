import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { ErrorList } from 'src/errorTexts';
import { PrismaService } from '../prisma/prisma.service';
import { AnswerDto } from './dto/answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create answer
   * @param template_id template id to which answer belongs
   * @returns created answer
   * @throws Answer with this name already exists
   * @throws Template with id does not exist
   */
  async create(template_id: number) {
    return await this.prisma.answer
      .create({
        data: {
          template_id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          // Throw error ïf name not unique
          throw new ConflictException(ErrorList.ConflictAnswer.errorMessage);
        } else if (error.code === 'P2003') {
          // Throw error if template not found
          throw new NotFoundException(ErrorList.TemplateNotFound.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });
  }

  /**
   * Find all answers in template
   * @param template_id template id
   * @returns all answers in template
   */
  async findAll(template_id: number, role: Role) {
    const template = await this.prisma.template.findUnique({
      where: {
        template_id,
      },
    });

    // Throw error if template not found
    if (!template) {
      throw new NotFoundException(ErrorList.TemplateNotFound.errorMessage);
    }

    const data: Prisma.AnswerFindManyArgs = {
      where: {
        template_id,
      },
    };

    if (role !== Role.ADMIN) {
      data.where.disabled = false;
    }

    const answers: AnswerDto[] = await this.prisma.answer.findMany(data);
    if (template.include_no_answer) {
      answers.push({
        disabled: false,
        template_id: template_id,
        answer_text: 'N/A',
      });
    }

    return answers;
  }

  /**
   * Find answer by id
   * @param answer_id answer id
   * @returns answer
   * @throws Answer not found
   */
  async findOne(answer_id: number) {
    const answer = await this.prisma.answer.findUnique({
      where: {
        answer_id,
      },
    });

    // Throw error if answer not found
    if (!answer) {
      throw new NotFoundException(ErrorList.AnswerNotFound.errorMessage);
    }

    // Return answer
    return answer;
  }

  /**
   * Update answer
   * @param answer_id answer id
   * @param updateAnswerDto answer data
   * @returns updated answer
   * @throws Answer not found
   * @throws Answer with this name already exists
   */
  async update(answer_id: number, updateAnswerDto: UpdateAnswerDto) {
    return await this.prisma.answer
      .update({
        where: {
          answer_id,
        },
        data: {
          ...updateAnswerDto,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          // Throw error ïf name not unique
          throw new ConflictException(ErrorList.ConflictAnswer.errorMessage);
        } else if (error.code === 'P2025') {
          // Throw error if template not found
          throw new NotFoundException(ErrorList.TemplateNotFound.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });
  }

  /**
   * Delete answer
   * @param answer_id answer id
   * @returns deleted answer
   * @throws Answer not found
   */
  async delete(answer_id: number) {
    return await this.prisma.answer
      .delete({
        where: {
          answer_id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          // Throw error if template not found
          throw new NotFoundException(ErrorList.TemplateNotFound.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });
  }
}
