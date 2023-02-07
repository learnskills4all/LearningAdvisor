import { Body, Controller, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { RecommendationDto } from './dto/recommendation.dto';
import { UpdateRecommendationDto } from './dto/UpdateRecommendation.dto';
import { FeedbackService } from './feedback.service';

// NestJS Controller class
// Controller decorator is used to define routes for the controller
// ApiTags decorator is used to define Swagger UI tags for this class
@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  /*
   * [PATCH] /feedback/{feedback_id}/recommendation
   * @param feedback_id feedback_id
   * @param updateRecommendationDto UpdateRecommendationDto
   */
  @Patch(':feedback_id')
  @Roles(Role.ASSESSOR, Role.ADMIN)
  @ApiResponse({
    description: 'Updated feedback',
    type: RecommendationDto,
  })
  @ApiNotFoundResponse({
    description: 'Feedback not found',
  })
  async updateRecommendation(
    @Param('feedback_id', ParseIntPipe) feedback_id: number,
    @Body() updateRecommendationDto: UpdateRecommendationDto
  ) {
    return this.feedbackService.updateRecommendation(
      feedback_id,
      updateRecommendationDto
    );
  }
}
