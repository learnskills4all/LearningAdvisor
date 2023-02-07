import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from '../category/category.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { TemplateDto } from './dto/template.dto';
import { TemplateService } from './template.service';
import { MaturityDto } from '../maturity/dto/maturity.dto';
import { MaturityService } from '../maturity/maturity.service';
import { CategoryDto } from '../category/dto/category.dto';
import { TopicDto } from '../topic/dto/topic.dto';
import { TopicService } from '../topic/topic.service';
import { AnswerDto } from '../answer/dto/answer.dto';
import { AnswerService } from '../answer/answer.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, User } from '@prisma/client';
import { CloneTemplateService } from './clone-template.service';
import AuthUser from '../common/decorators/auth-user.decorator';

@Controller('template')
@ApiTags('template')
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly categoryService: CategoryService,
    private readonly maturityService: MaturityService,
    private readonly topicService: TopicService,
    private readonly answerService: AnswerService,
    private readonly cloneTemplateService: CloneTemplateService
  ) {}

  /**
   * [GET] /template - Get all templates
   * @returns TemplateResponse[] List of all templates
   */
  @ApiResponse({
    description: 'Found templates',
    type: TemplateDto,
    isArray: true,
  })
  @Get('')
  //@Roles(Role.ADMIN)
  async findAll(@AuthUser() user: User): Promise<TemplateDto[]> {
    return this.templateService.findAll(user.role);
  }

  /**
   * [POST] /template - Create a new template
   * @param body - Template name and type
   * @returns Created template
   */
  @Post('')
  @ApiResponse({ description: 'Created template', type: TemplateDto })
  @ApiConflictResponse({
    description: 'Template with this name and type already exists',
  })
  @Roles(Role.ADMIN)
  async create(
    @Body() { template_type }: CreateTemplateDto
  ): Promise<TemplateDto> {
    return this.templateService.create(template_type);
  }

  /**
   * [GET] /template/:id - Get template by id
   * @param id template_id
   * @returns Template object
   */
  @Get(':template_id')
  @ApiResponse({ description: 'Template', type: TemplateDto })
  @ApiNotFoundResponse()
  async findOne(
    @Param('template_id', ParseIntPipe) id: number
  ): Promise<TemplateDto> {
    return this.templateService.findOne(id);
  }

  /**
   * [PATCH] /template/:id - Update template by id
   * @param id template_id
   * @param updateTemplateDto Template data
   * @returns Updated template
   */
  @Patch(':template_id')
  @ApiResponse({ description: 'Template', type: TemplateDto })
  @ApiNotFoundResponse({ description: 'Template not found' })
  @ApiConflictResponse({
    description: 'Template with this name and type already exists',
  })
  @Roles(Role.ADMIN)
  async update(
    @Param('template_id', ParseIntPipe) id: number,
    @Body() updateTemplateDto: UpdateTemplateDto
  ): Promise<TemplateDto> {
    return this.templateService.update(id, updateTemplateDto);
  }

  /**
   * [DELETE] /template/:id - Delete template by id
   * @param id template_id
   * @returns Deleted template
   */
  @Delete(':template_id')
  @ApiResponse({ description: 'Deleted template', type: TemplateDto })
  @ApiNotFoundResponse({ description: 'Template not found' })
  @Roles(Role.ADMIN)
  async delete(
    @Param('template_id', ParseIntPipe) id: number
  ): Promise<TemplateDto> {
    return this.templateService.delete(id);
  }

  /**
   * [POST] /template/:id/clone - Clone template by id
   * @param id template_id
   * @returns Cloned template
   */
  @Post(':template_id/clone')
  @ApiResponse({ description: 'Template', type: TemplateDto })
  @ApiNotFoundResponse({ description: 'Template not found' })
  @Roles(Role.ADMIN)
  async clone(
    @Param('template_id', ParseIntPipe) id: number
  ): Promise<TemplateDto> {
    return this.cloneTemplateService.clone(id);
  }

  /**
   * [POST] /template/:id/category - Create new category for template
   * @param id template_id
   * @param body Category data
   * @returns Created category
   */
  @Post(':template_id/category')
  @ApiTags('category')
  @ApiResponse({ description: 'Category', type: CategoryDto })
  @ApiNotFoundResponse({ description: 'Template not found' })
  @ApiConflictResponse({
    description: 'Category with this already exists',
  })
  @Roles(Role.ADMIN)
  async createCategory(
    @Param('template_id', ParseIntPipe) id: number
  ): Promise<CategoryDto> {
    return this.categoryService.create(id);
  }

  /**
   * [GET] /template/:id/category - Get all categories for template
   * @param id template_id
   * @returns CategoryResponse[] List of all categories
   */
  @Get(':template_id/category')
  @ApiTags('category')
  @ApiResponse({
    description: 'Found categories',
    type: CategoryDto,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Template not found' })
  async findAllCategories(
    @Param('template_id', ParseIntPipe) id: number,
    @AuthUser() user: User
  ): Promise<CategoryDto[]> {
    return this.categoryService.findAll(id, user.role);
  }

  /**
   * [POST] /template/:template_id/maturity - Create new maturity for template
   * @param id template_id
   * @param body Maturity data
   * @returns Created maturity
   */
  @Post(':template_id/maturity')
  @ApiTags('maturity')
  @ApiResponse({ description: 'Maturity', type: MaturityDto })
  @ApiNotFoundResponse({ description: 'Template not found' })
  @ApiConflictResponse({
    description: 'Maturity with this name already exists',
  })
  @Roles(Role.ADMIN)
  async createMaturity(
    @Param('template_id', ParseIntPipe) id: number
  ): Promise<MaturityDto> {
    return this.maturityService.create(id);
  }

  /**
   * [GET] /template/:template_id/maturity - Get all maturity for template
   * @param id template_id
   * @returns MaturityDto[] List of all maturity
   * @throws NotFoundException if template not found
   */
  @Get(':template_id/maturity')
  @ApiTags('maturity')
  @ApiResponse({
    description: 'Found maturities',
    type: MaturityDto,
    isArray: true,
  })
  @ApiNotFoundResponse({ description: 'Template not found' })
  async findAllMaturities(
    @Param('template_id', ParseIntPipe) id: number,
    @AuthUser() user: User
  ): Promise<MaturityDto[]> {
    return this.maturityService.findAll(id, user.role);
  }

  /**
   * [GET] /template/:template_id/topic - Get all topics for template
   * @param template_id template_id
   * @returns TopicDto[] List of all topics
   */
  @Get(':template_id/topic')
  @ApiTags('topic')
  @ApiResponse({
    description: 'Found topics',
    type: TopicDto,
    isArray: true,
  })
  async findAllTopics(
    @Param('template_id', ParseIntPipe) template_id: number,
    @AuthUser() user: User
  ) {
    return this.topicService.findAll(template_id, user.role);
  }

  /**
   * [POST] /template/:template_id/topic - Create new topic for template
   * @param template_id template_id
   * @returns Created topic
   * @throws NotFoundException if template not found
   * @throws ConflictException if topic with this name already exists
   */
  @Post(':template_id/topic')
  @Roles(Role.ADMIN)
  @ApiTags('topic')
  @ApiResponse({ description: 'Topic', type: TopicDto })
  @ApiNotFoundResponse({ description: 'Template not found' })
  @ApiConflictResponse({
    description: 'Topic with this name already exists',
  })
  async createTopic(@Param('template_id', ParseIntPipe) template_id: number) {
    return this.topicService.create(template_id);
  }

  /**
   * [GET] /template/:template_id/answer - Get all answers for template
   * @param template_id template_id
   * @returns AnswerDto[] List of all answers
   */
  @Get(':template_id/answer')
  @ApiTags('answer')
  @ApiResponse({
    description: 'Found answers',
    type: AnswerDto,
    isArray: true,
  })
  async getAnswers(
    @Param('template_id', ParseIntPipe) template_id: number,
    @AuthUser() user: User
  ) {
    return this.answerService.findAll(template_id, user.role);
  }

  /**
   * Create ansewr for template
   * @param template_id template_id
   * @returns Created answer
   */
  @Post(':template_id/answer')
  @Roles(Role.ADMIN)
  @ApiTags('answer')
  @ApiResponse({ description: 'Answer', type: AnswerDto })
  @ApiConflictResponse({
    description: 'Answer with this name already exists',
  })
  async createAnswer(@Param('template_id', ParseIntPipe) template_id: number) {
    return this.answerService.create(template_id);
  }
}
