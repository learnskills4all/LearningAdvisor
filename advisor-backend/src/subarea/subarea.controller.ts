import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SubareaService } from './subarea.service';
import { UpdateSubareaDto } from './dto/update-subarea.dto';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SubareaDto } from './dto/subarea.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('subarea')
@ApiTags('subarea')
export class SubareaController {
  constructor(private readonly subareaService: SubareaService) {}

  /**
   * [GET] /subarea/:id - Get subarea by id
   * @param id subarea id
   * @returns subarea
   */
  @Get(':subarea_id')
  @ApiResponse({
    description: 'The found subarea',
    type: SubareaDto,
  })
  @ApiNotFoundResponse({ description: 'Subarea not found' })
  findOne(@Param('subarea_id', ParseIntPipe) id: number) {
    return this.subareaService.findOne(id);
  }

  /**
   * [PATCH] /subarea/:id - Update subarea by id
   * @param id subarea id
   * @param updateSubareaDto subarea data
   * @returns updated subarea
   */
  @Patch(':subarea_id')
  @ApiResponse({
    description: 'The updated subarea',
    type: SubareaDto,
  })
  @ApiNotFoundResponse({ description: 'Subarea not found' })
  @ApiConflictResponse({ description: 'Subarea with this name already exists' })
  @Roles(Role.ADMIN)
  update(
    @Param('subarea_id', ParseIntPipe) id: number,
    @Body() updateSubareaDto: UpdateSubareaDto
  ) {
    return this.subareaService.update(id, updateSubareaDto);
  }

  /**
   * [DELETE] /subarea/:id - Delete subarea by id
   * @param id subarea id
   * @returns deleted subarea
   */
  @Delete(':subarea_id')
  @ApiResponse({
    description: 'The deleted subarea',
    type: SubareaDto,
  })
  @ApiNotFoundResponse({ description: 'Subarea not found' })
  @Roles(Role.ADMIN)
  delete(@Param('subarea_id', ParseIntPipe) id: number) {
    return this.subareaService.delete(id);
  }
}
