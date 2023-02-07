import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { ErrorList } from 'src/errorTexts';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSubareaDto } from './dto/update-subarea.dto';

@Injectable()
export class SubareaService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create subarea
   * @param category_id category id to which subarea belongs
   * @param createSubareaDto subarea data
   * @returns created subarea
   * @throws Subarea with this name already exists
   * @throws Category not found
   */
  async create(category_id: number) {
    const order = await this.prisma.subArea.count({
      where: {
        category_id,
      },
    });

    return await this.prisma.subArea
      .create({
        data: {
          category_id,
          order: order + 1,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new ConflictException(ErrorList.ConflictSubareaName.errorMessage);
        } else if (error.code === 'P2003') {
          throw new NotFoundException(ErrorList.CategoryNotFound.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });
  }

  /**
   * Find all subareas in category
   * @param category_id category id
   * @returns all subareas in category
   */
  async findAll(category_id: number, role: Role) {
    const data: Prisma.SubAreaFindManyArgs = {
      where: {
        category_id,
      },
    };

    if (role !== Role.ADMIN) {
      data.where.disabled = false;
    }

    return await this.prisma.subArea.findMany(data);
  }

  /**
   * Get subarea by id
   * @param subarea_id subarea id
   * @returns subarea
   * @throws Subarea not found
   */
  async findOne(subarea_id: number) {
    const subarea = await this.prisma.subArea.findUnique({
      where: {
        subarea_id,
      },
    });

    // throw error if subarea not found
    if (!subarea) {
      throw new NotFoundException(ErrorList.SubareaNotFound.errorMessage);
    }

    return subarea;
  }

  /**
   * Update subarea
   * @param subarea_id subarea id
   * @param updateSubareaDto subarea data
   * @returns updated subarea
   * @throws Subarea not found
   * @throws Subarea with this name already exists
   */
  async update(subarea_id: number, updateSubareaDto: UpdateSubareaDto) {
    const subarea = await this.prisma.subArea.findUnique({
      where: {
        subarea_id,
      },
    });

    if (!subarea) {
      throw new NotFoundException(ErrorList.SubareaNotFound.errorMessage);
    }

    const newOrder = updateSubareaDto.order;

    // Update order if order is changed
    if (newOrder) {
      // Get the max order in category
      const maxOrder = await this.prisma.subArea.count({
        where: {
          category_id: subarea.category_id,
        },
      });

      // Check if new order is valid
      if (newOrder > maxOrder) {
        throw new ConflictException(ErrorList.ConflictOrderSubarea.errorMessage);
      }
    }

    const updatedSubarea = await this.prisma.subArea
      .update({
        where: {
          subarea_id,
        },
        data: updateSubareaDto,
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new ConflictException(ErrorList.ConflictSubareaName.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });

    // If new order is lower, increment everything between new and old order
    if (newOrder && newOrder < subarea.order) {
      await this.prisma.subArea.updateMany({
        where: {
          category_id: subarea.category_id,
          subarea_id: {
            not: subarea.subarea_id,
          },
          order: {
            gte: updateSubareaDto.order,
            lte: subarea.order,
          },
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });
    } else if (newOrder && newOrder > subarea.order) {
      // If new order is higher, decrement everything between old and new order
      await this.prisma.subArea.updateMany({
        where: {
          category_id: subarea.category_id,
          subarea_id: {
            not: subarea.subarea_id,
          },
          order: {
            gte: subarea.order,
            lte: updateSubareaDto.order,
          },
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });
    }

    return updatedSubarea;
  }

  /**
   * Delete subarea
   * @param subarea_id subarea id
   * @returns deleted subarea
   * @throws Subarea not found
   */
  async delete(subarea_id: number) {
    // Delete subarea
    const deletedSubarea = await this.prisma.subArea
      .delete({
        where: {
          subarea_id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException(ErrorList.SubareaNotFound.errorMessage);
        }
        console.log(error);
        throw new InternalServerErrorException();
      });

    // Create new order for all subareas after deleted subarea
    await this.prisma.subArea.updateMany({
      where: {
        category_id: deletedSubarea.category_id,
        order: {
          gte: deletedSubarea.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });
    return deletedSubarea;
  }
}
