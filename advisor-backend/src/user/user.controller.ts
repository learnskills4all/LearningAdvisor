import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UserService } from './user.service';
import { Roles } from '../common/decorators/roles.decorator';
import { userResponse } from './dto/userResponse.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * [GET] /user - Get all users
   * @returns userResponse[] List of all users
   */
  @ApiResponse({
    description: 'Found users',
    type: userResponse,
    isArray: true,
  })
  @Get('')
  @Roles(Role.ADMIN)
  async findAll(): Promise<any> {
    return this.userService.findAll();
  }

  /**
   * [GET] /user/:id
   * @param id user_id
   * @returns user object
   */
  @ApiResponse({ description: 'Found user', type: userResponse })
  @Get(':id')
  @Roles(Role.ADMIN)
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUser(id);
  }

  /**
   * [PATCH] /user/:id - Update user
   * @param id user_id
   * @param updateUserDto Update user data
   * @returns user object
   */
  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiResponse({
    description: 'updated user',
    type: userResponse,
  })
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  /**
   * [DELETE] /user/:id - Delete user by id
   * @param id user_id
   * @returns Deleted user
   */
  @Delete(':user_id')
  @ApiResponse({ description: 'Deleted user', type: userResponse })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Roles(Role.ADMIN)
  async delete(@Param('user_id', ParseIntPipe) id: number): Promise<any> {
    return this.userService.delete(id);
  }
}
