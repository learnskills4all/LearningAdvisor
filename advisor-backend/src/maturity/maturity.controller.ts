import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MaturityService } from './maturity.service';
import { UpdateMaturityDto } from './dto/update-maturity.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MaturityDto } from './dto/maturity.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

// NestJS Controller class
// Controller decorator is used to define routes for the controller
// ApiTags decorator is used to define Swagger UI tags for this class
@Controller('maturity')
@ApiTags('maturity')
export class MaturityController {
  constructor(private readonly maturityService: MaturityService) {}

  /*
   * [GET] /maturity/{maturity_id}
   * @param maturity_id maturity_id
   * @returns MaturityDto
   */
  @Get(':maturity_id')
  @ApiResponse({ description: 'Found maturity', type: MaturityDto })
  @ApiNotFoundResponse({ description: 'Maturity not found' })
  findOne(@Param('maturity_id', ParseIntPipe) id: number) {
    return this.maturityService.findOne(id);
  }

  /*
   * [PATCH] /maturity/{maturity_id}
   * @param maturity_id maturity_id
   * @param updateMaturityDto UpdateMaturityDto
   * @returns MaturityDto
   * Permission: ADMIN
   */
  @Patch(':maturity_id')
  @ApiResponse({ description: 'Updated maturity', type: MaturityDto })
  @ApiNotFoundResponse({ description: 'Maturity not found' })
  @ApiConflictResponse({
    description: 'Maturity with this name already exists',
  })
  @ApiBadRequestResponse({
    description:
      'Maturity order must be less than number of maturities in template',
  })
  @Roles(Role.ADMIN)
  update(
    @Param('maturity_id', ParseIntPipe) id: number,
    @Body() updateMaturityDto: UpdateMaturityDto
  ) {
    return this.maturityService.update(id, updateMaturityDto);
  }

  /*
   * [DELETE] /maturity/{maturity_id}
   * @param maturity_id maturity_id
   * @returns MaturityDto
   * Permission: ADMIN
   */
  @Delete(':maturity_id')
  @ApiResponse({ description: 'Deleted maturity', type: MaturityDto })
  @ApiNotFoundResponse({ description: 'Maturity not found' })
  @Roles(Role.ADMIN)
  delete(@Param('maturity_id', ParseIntPipe) id: number) {
    return this.maturityService.delete(id);
  }
}
