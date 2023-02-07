import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CheckpointService } from './checkpoint.service';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';
import { CheckpointDto } from './dto/checkpoint.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
@ApiTags('checkpoint')
@Controller('checkpoint')
export class CheckpointController {
  constructor(private readonly checkpointService: CheckpointService) {}

  /**
   * [GET] /checkpoint/:checkpoint_id - Get checkpoint by id
   * @param id - Template id
   * @returns checkpointDto
   */
  @Get(':checkpoint_id')
  @ApiResponse({
    description: 'Found checkpoint',
    type: CheckpointDto,
  })
  @ApiNotFoundResponse({
    description: 'checkpoint not found',
  })
  findOne(@Param('checkpoint_id', ParseIntPipe) id: number) {
    return this.checkpointService.findOne(id);
  }

  /**
   * [PATCH] /checkpoint/:checkpoint_id - Update checkpoint by id
   * @param id - Template id
   * @param UpdateCheckpointDto - Template update information
   * @returns checkpointDto
   */
  @Patch(':checkpoint_id')
  @Roles(Role.ADMIN)
  @ApiResponse({ description: 'Updated checkpoint', type: CheckpointDto })
  @ApiNotFoundResponse({ description: 'checkpoint not found' })
  @ApiBadRequestResponse({
    description: 'Order must be less than number of categories in template',
  })
  @ApiNotFoundResponse({ description: 'Maturity not found' })
  @ApiBadRequestResponse({
    description: 'Weight is not within template weight range',
  })
  update(
    @Param('checkpoint_id', ParseIntPipe) id: number,
    @Body() updatecheckpointDto: UpdateCheckpointDto
  ) {
    return this.checkpointService.update(id, updatecheckpointDto);
  }

  /**
   * [DELETE] /checkpoint/:checkpoint_id - Delete checkpoint
   * @param id - checkpoint id
   * @returns Deleted checkpoint
   */
  @Delete(':checkpoint_id')
  @Roles(Role.ADMIN)
  @ApiResponse({ description: 'Deleted checkpoint', type: CheckpointDto })
  @ApiNotFoundResponse({ description: 'checkpoint not found' })
  delete(@Param('checkpoint_id', ParseIntPipe) id: number) {
    return this.checkpointService.delete(+id);
  }
}
