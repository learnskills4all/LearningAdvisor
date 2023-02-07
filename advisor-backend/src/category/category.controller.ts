import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SubareaService } from '../subarea/subarea.service';
import { SubareaDto } from '../subarea/dto/subarea.dto';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CheckpointDto } from '../checkpoint/dto/checkpoint.dto';
import { CheckpointService } from '../checkpoint/checkpoint.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, User } from '@prisma/client';
import AuthUser from '../common/decorators/auth-user.decorator';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly subareaService: SubareaService,
    private readonly checkpointService: CheckpointService
  ) {}

  /**
   * [GET] /category/:category_id - Get category by id
   * @param category_id - Template id
   * @returns CategoryDto
   */
  @Get(':category_id')
  @ApiResponse({
    description: 'Found category',
    type: CategoryDto,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  findOne(@Param('category_id', ParseIntPipe) category_id: number) {
    return this.categoryService.findOne(category_id);
  }

  /**
   * [PATCH] /category/:category_id - Update category by id
   * @param category_id - Template id
   * @param updateCategoryDto - Template update information
   * @returns CategoryDto
   */
  @Patch(':category_id')
  @ApiResponse({ description: 'Updated category', type: CategoryDto })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiBadRequestResponse({
    description: 'Order must be less than number of categories in template',
  })
  @Roles(Role.ADMIN)
  update(
    @Param('category_id', ParseIntPipe) category_id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.update(category_id, updateCategoryDto);
  }

  /**
   * [DELETE] /category/:category_id - Delete category
   * @param category_id - Category id
   * @returns Deleted category
   */
  @Delete(':category_id')
  @ApiResponse({ description: 'Deleted category', type: CategoryDto })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @Roles(Role.ADMIN)
  delete(@Param('category_id', ParseIntPipe) category_id: number) {
    return this.categoryService.delete(category_id);
  }

  /**
   * [GET] /category/:subarea_id/subarea - Get all subareas
   * @param category_id category id
   * @returns subareas
   */
  @Get(':category_id/subarea')
  @ApiTags('subarea')
  @ApiResponse({
    description: 'The found subareas',
    type: SubareaDto,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  findAllSubareas(
    @Param('category_id', ParseIntPipe) category_id: number,
    @AuthUser() user: User
  ) {
    return this.subareaService.findAll(category_id, user.role);
  }

  /**
   * [POST] /category/:subarea_id/subarea - Create new subarea
   * @param category_id category id
   * @param subareaDto subarea data
   * @returns created subarea
   */
  @Post(':category_id/subarea')
  @ApiTags('subarea')
  @ApiResponse({
    description: 'The created subarea',
    type: SubareaDto,
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiConflictResponse({ description: 'Subarea with this name already exists' })
  @Roles(Role.ADMIN)
  createSubarea(@Param('category_id', ParseIntPipe) category_id: number) {
    return this.subareaService.create(category_id);
  }

  /**
   * [GET] /category/:category_id/checkpoint - Get all checkpoints in category
   * @param category_id category id
   * @returns List of checkpoints in category
   */
  @Get(':category_id/checkpoint')
  @ApiTags('checkpoint')
  @ApiResponse({
    description: 'Checpoints in category',
    type: CheckpointDto,
    isArray: true,
  })
  findCheckpoints(
    @Param('category_id', ParseIntPipe) category_id: number,
    @AuthUser() user: User
  ) {
    return this.checkpointService.findAll(category_id, user.role);
  }

  /**
   * [POST] /category/:category_id/checkpoint - Create new checkpoint
   * @param category_id category id
   * @returns Created checkpoint
   * @throw Category not found
   * @throw Checkpoint with name already exists
   */
  @Post(':category_id/checkpoint')
  @ApiTags('checkpoint')
  @Roles(Role.ADMIN)
  @ApiResponse({
    description: 'created checkpoint',
    type: CheckpointDto,
  })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiConflictResponse({
    description: 'Category with this name already exists',
  })
  createCheckpoint(@Param('category_id', ParseIntPipe) category_id: number) {
    return this.checkpointService.create(category_id);
  }
}
