import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ForbiddenException,
  Query,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { AssessmentDto } from './dto/assessment.dto';
import { FeedbackDto } from './dto/feedback.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { ScoreDto } from './dto/score.dto';
import { AssessmentScoreService } from './assessment-score.service';
import { Role, User } from '@prisma/client';
import AuthUser from '../common/decorators/auth-user.decorator';
import { RecommendationDto } from '../feedback/dto/recommendation.dto';
import { FeedbackService } from '../feedback/feedback.service';
import { SaveService } from '../save/save.service';
import { SaveCheckpointDto } from '../save/dto/save-checkpoint.dto';

@ApiTags('assessment')
@Controller('assessment')
export class AssessmentController {
  constructor(
    private readonly assessmentService: AssessmentService,
    private readonly assessmentScoreService: AssessmentScoreService,
    private readonly saveService: SaveService,
    private readonly feedbackService: FeedbackService
  ) {}

  /**
   * [POST] /assessment - create new assessment
   * @param createAssessmentDto Assessment information
   * @returns created assessment
   */
  @Post('')
  @ApiConflictResponse({
    description: 'Assessment with this name and type already exists',
  })
  @ApiNotFoundResponse({
    description: 'Team not found',
  })
  @ApiBadRequestResponse({
    description: 'No active templates found',
  })
  create(
    @Body() createAssessmentDto: CreateAssessmentDto,
    @AuthUser() user: User
  ) {
    return this.assessmentService.create(createAssessmentDto, user);
  }

  /**
   * [GET] /assessment - get all assessments
   * @returns AssessmentDto List of all assessments
   */
  @Get()
  @ApiResponse({
    description: 'Found assessments',
    type: AssessmentDto,
    isArray: true,
  })
  @Roles(Role.ADMIN)
  findAll() {
    return this.assessmentService.findAll();
  }

  /**
   * [GET] /assessment/my - get my assessments
   * @param user User
   * @returns AssessmentDto[] List of all assessments
   */
  @Get('my')
  @ApiResponse({
    description: 'Found assessment of USER',
    type: AssessmentDto,
    isArray: true,
  })
  findUserAssessments(@AuthUser() user: User) {
    return this.assessmentService.findUserAssessments(user);
  }

  /**
   * [GET] /assessment/:id - get assessment by id
   * @param id assessment_id
   * @returns Assessment object
   */
  @Get(':assessment_id')
  @ApiResponse({ description: 'Assessment', type: AssessmentDto })
  @ApiNotFoundResponse({ description: 'Assessment not found' })
  async findOne(
    @Param('assessment_id', ParseIntPipe) id: number,
    @AuthUser() user: User
  ) {
    const assessment = await this.assessmentService.userInAssessment(id, user);

    if (!assessment) {
      throw new ForbiddenException();
    }

    return this.assessmentService.findOne(id);
  }

  /**
   * [PATCH] /assessment/:id - update assessment by id
   * @param id assessment_id
   * @param updateAssessmentDto updated assessment information
   * @returns
   */
  @Patch(':assessment_id')
  @ApiResponse({ description: 'Assessment', type: AssessmentDto })
  @ApiNotFoundResponse({ description: 'Assessment not found' })
  @ApiConflictResponse({
    description: 'Assessment with this name and type already exists',
  })
  async update(
    @Param('assessment_id', ParseIntPipe) id: number,
    @Body() updateAssessmentDto: UpdateAssessmentDto,
    @AuthUser() user: User
  ) {
    const assessment = await this.assessmentService.userInAssessment(id, user);

    if (!assessment) {
      throw new ForbiddenException();
    }

    return this.assessmentService.update(id, updateAssessmentDto);
  }

  /**
   * [DELETE] /assessment/:id - delete assessment by id
   * @param id assessment_id
   * @returns deleted Assessment object
   */
  @Delete(':assessment_id')
  @ApiResponse({ description: 'Assessment', type: AssessmentDto })
  @ApiNotFoundResponse({ description: 'Assessment not found' })
  async delete(
    @Param('assessment_id', ParseIntPipe) id: number,
    @AuthUser() user: User
  ) {
    const assessment = await this.assessmentService.userInAssessment(id, user);

    if (!assessment) {
      throw new ForbiddenException();
    }

    return this.assessmentService.delete(id);
  }

  /**
   * [POST] /assessment/:id/complete - mark assessment as complete
   * @param id assessment_id
   * @returns updated Assessment object
   */
  @Post(':assessment_id/complete')
  @ApiResponse({ description: 'Assessment', type: AssessmentDto })
  @ApiNotFoundResponse({ description: 'Assessment not found' })
  async complete(
    @Param('assessment_id', ParseIntPipe) id: number,
    @AuthUser() user: User
  ) {
    const assessment = await this.assessmentService.userInAssessment(id, user);

    if (!assessment) {
      throw new ForbiddenException();
    }

    return this.assessmentService.complete(id);
  }

  /**
   * [POST] /assessment/:id/save - save checkpoint
   * @param assessment_id assessment_id
   * @param saveCheckpointDto save checkpoint information
   * @returns Checkpoint saved
   */
  @Post(':assessment_id/save')
  @ApiOkResponse({ description: 'Checkpoint saved' })
  @ApiNotFoundResponse({ description: 'Assessment not found' })
  async saveCheckpointAnswer(
    @Param('assessment_id', ParseIntPipe) assessment_id: number,
    @Body() saveCheckpointDto: SaveCheckpointDto,
    @AuthUser() user: User
  ) {
    // Check if user in assessment
    const assessment = await this.assessmentService.userInAssessment(
      assessment_id,
      user
    );

    if (!assessment || assessment.completed_at) {
      throw new ForbiddenException();
    }

    return this.saveService.saveCheckpoint(assessment, saveCheckpointDto);
  }

  /**
   * [GET] /assessment/:id/save - get saved checkpoints
   * @param assessment_id assessment_id
   * @returns Saved checkpoints
   */
  @Get(':assessment_id/save')
  @ApiResponse({
    description: 'Saved checkpoints',
    type: SaveCheckpointDto,
    isArray: true,
  })
  async getSavedCheckpoints(
    @Param('assessment_id', ParseIntPipe) assessment_id: number,
    @AuthUser() user: User
  ) {
    // Check if user in assessment
    const assessment = await this.assessmentService.userInAssessment(
      assessment_id,
      user
    );

    if (!assessment) {
      throw new ForbiddenException();
    }

    return this.saveService.getSavedCheckpoints(assessment);
  }

  /**
   * [POST] /assessment/:id/feedback - Add feedback to assessment
   * @param id assessment_id
   * @returns updated Assessment object
   */
  @Post(':assessment_id/feedback')
  @Roles(Role.ASSESSOR, Role.ADMIN)
  @ApiResponse({ description: 'Assessment', type: AssessmentDto })
  @ApiNotFoundResponse({ description: 'Assessment not found' })
  feedback(
    @Param('assessment_id', ParseIntPipe) id: number,
    @Body() feedbackDto: FeedbackDto
  ) {
    return this.assessmentService.feedback(id, feedbackDto);
  }

  /**
   * [GET] /assessment/{assessment_id}/score - get score for all topics
   * @param assessment_id assessment_id
   * @returns scoreDto
   * @throws NotFoundException if assessment not found
   * @throws ForbiddenException if assessment type is INDIVIDUAL
   * @throws BadRequestException if assessment is not completed
   * @throws BadRequestException if no enabled maturities found associated to this template
   * @throws BadRequestException if no enabled categories found associated to this template
   * @throws BadRequestException if topic not found or not enabled for this template
   * @throws BadRequestException if no enabled checkpoints found associated to this template
   * @throws BadRequestException if no enabled possible answers found associated to this template
   */
  @Get(':assessment_id/score')
  @ApiResponse({
    description:
      'Score for all topics (if score is -1, this means that there are no \
         checkpoints related to this maturity category pair)',
    type: ScoreDto,
  })
  @ApiNotFoundResponse({ description: 'Assessment not found' })
  @ApiBadRequestResponse({
    description: 'Individual assessment cannot be scored',
  })
  @ApiInternalServerErrorResponse()
  @ApiQuery({
    name: 'topic_id',
    required: false,
    type: Number,
  })
  async getScore(
    @Param('assessment_id', ParseIntPipe) id: number,
    @Query('topic_id') topic_id?: number
  ) {
    return this.assessmentScoreService.getScore(id, topic_id);
  }

  @Get(':assessment_id/feedback')
  @ApiTags('feedback')
  @ApiNotFoundResponse({ description: 'Assessment not found' })
  @ApiQuery({
    name: 'topic_id',
    required: false,
    type: Number,
  })
  @ApiResponse({
    description: 'Recommendations',
    type: RecommendationDto,
    isArray: true,
  })
  async getRecommendations(
    @Param('assessment_id', ParseIntPipe) assessment_id: number,
    @AuthUser() user: User,
    @Query('topic_id') topic_id?: number
  ) {
    // Check if user in assessment
    const assessment = await this.assessmentService.userInAssessment(
      assessment_id,
      user
    );

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    return this.feedbackService.getRecommendations(assessment, topic_id);
  }
}
