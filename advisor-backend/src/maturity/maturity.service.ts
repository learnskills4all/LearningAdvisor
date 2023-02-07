import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { ErrorList } from 'src/errorTexts';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMaturityDto } from './dto/update-maturity.dto';

@Injectable()
export class MaturityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create maturity
   * @param template_id template id to which maturity belongs
   * @returns created maturity
   * @throws Maturity with this name already exists
   * @throws Template with id does not exist
   */
  async create(template_id: number) {
    const order = await this.prisma.maturity.count({
      where: {
        template_id,
      },
    });

    return await this.prisma.maturity
      .create({
        data: {
          template_id,
          order: order + 1,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          // Throw error ïf name and type not unique
          throw new ConflictException(ErrorList.ConflictMaturityName.errorMessage);
        } else if (error.code === 'P2003') {
          // Throw error if template not found
          throw new NotFoundException(ErrorList.TemplateNotFound.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });
  }

  /**
   * Find all maturities in template
   * @param template_id template id
   * @returns all maturities in template
   */
  async findAll(template_id: number, role: Role) {
    const data: Prisma.MaturityFindManyArgs = {
      where: {
        template_id,
      },
    };

    if (role !== Role.ADMIN) {
      data.where.disabled = false;
    }

    return await this.prisma.maturity.findMany(data);
  }

  /**
   * Get maturity by id
   * @param maturity_id maturity id
   * @returns maturity
   * @throws Maturity not found
   */
  async findOne(maturity_id: number) {
    // Get template by id from prisma
    const maturity = await this.prisma.maturity.findUnique({
      where: {
        maturity_id,
      },
    });

    // Throw NotFoundException if maturity not found
    if (!maturity) {
      throw new NotFoundException(ErrorList.MaturityNotFound.errorMessage);
    }

    return maturity;
  }

  /**
   * Update maturity
   * @param maturity_id maturity id
   * @param updateMaturityDto maturity data
   * @returns updated maturity
   */
  async update(maturity_id: number, updateMaturityDto: UpdateMaturityDto) {
    const maturity = await this.prisma.maturity.findUnique({
      where: {
        maturity_id,
      },
    });

    // If maturity is not found throw NotFoundException
    if (!maturity) {
      throw new NotFoundException(ErrorList.MaturityNotFound.errorMessage);
    }

    const newOrder = updateMaturityDto.order;

    if (newOrder) {
      // Check if order is valid (not more than number of maturity in template)
      const order = await this.prisma.maturity.count({
        where: {
          template_id: maturity.template_id,
        },
      });

      // If order is not valid throw BadRequestException
      if (newOrder > order) {
        throw new BadRequestException(ErrorList.BadMaturityOrderTemplate.errorMessage);
      }
    }

    // Update maturity
    const updatedMaturity = await this.prisma.maturity
      .update({
        where: {
          maturity_id,
        },
        data: updateMaturityDto,
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          // Throw error ïf name not unique
          throw new ConflictException(ErrorList.ConflictMaturityName.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });

    // If new order is smaller than old order, increase order of all maturities with between new and old order
    if (newOrder && newOrder < maturity.order) {
      await this.prisma.maturity.updateMany({
        where: {
          template_id: maturity.template_id,
          maturity_id: {
            not: maturity.maturity_id,
          },
          order: {
            gte: updateMaturityDto.order,
            lte: maturity.order,
          },
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });
    } else if (newOrder && newOrder > maturity.order) {
      // If new order is bigger than old order, decrease order of all maturities with between old and new order
      await this.prisma.maturity.updateMany({
        where: {
          template_id: maturity.template_id,
          maturity_id: {
            not: maturity.maturity_id,
          },
          order: {
            gte: maturity.order,
            lte: updateMaturityDto.order,
          },
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });
    }
    return updatedMaturity;
  }

  /**
   * Delete maturity
   * @param maturity_id maturity id
   * @returns deleted maturity
   * @throws Maturity not found
   */
  async delete(maturity_id: number) {
    // Delete maturity
    const deletedMaturity = await this.prisma.maturity
      .delete({
        where: {
          maturity_id,
        },
      })
      .catch((error) => {
        // Throw error if template not found
        if (error.code === 'P2025') {
          throw new NotFoundException(ErrorList.MaturityNotFound.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });

    // Decrement order of all maturities with order bigger than deleted maturity
    await this.prisma.maturity.updateMany({
      where: {
        template_id: deletedMaturity.template_id,
        order: {
          gte: deletedMaturity.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });
    return deletedMaturity;
  }
}
