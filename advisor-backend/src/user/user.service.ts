import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../auth/dto/register-user.dto';
import { User } from '../../node_modules/.prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import { ErrorList } from 'src/errorTexts';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Get all users
   * @returns All users
   */
  async findAll(): Promise<any> {
    // Return all templates from prisma
    const users = await this.prisma.user.findMany();
    users.forEach((user) => delete user.password);
    return users;
  }

  /**
   * Get user object by id
   * @param id id of user
   * @returns user object corresponding to user_id, null if not found
   * @throws NotFoundException if user not found
   */
  async getUser(id: number): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        user_id: id,
      },
    });

    if (!user) {
      throw new NotFoundException(ErrorList.UserNotFound.errorMessage);
    }

    delete user.password;

    return user;
  }

  /**
   * Update user
   * @param id user_id
   * @param data UpdateUserDto
   * @returns Updated user
   */
  async updateUser(id: number, data: UpdateUserDto) {
    const user = await this.prisma.user
      .update({
        where: {
          user_id: id,
        },
        data,
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException(ErrorList.UserIDNotFound.errorMessage);
        }
        // console.log(error);
        throw new InternalServerErrorException();
      });
    delete user.password;
    return user;
  }

  /**
   * Create user
   * @param data CreateUserDto
   * @returns Created user
   * @throws Username already exists
   */
  async createUser(data: CreateUserDto): Promise<User> {
    // generate random usernames
    const randomWords = require('random-words');
    const new_username = randomWords({
      min: 2,
      max: 3,
      join: '_',
    });

    const username = await this.prisma.user
      .findUnique({
        where: {
          username: new_username
        }
      });

    if (username) {
      throw new BadRequestException(ErrorList.BadUser.errorMessage);
    }

    // generate a uuidv4
    const myuuid = uuidv4();

    // compute hash of password
    const salt = 10;
    const hashedPassword = await bcrypt.hash(myuuid, salt);

    const user = await this.prisma.user
      .create({
        data: {
          ...data,
          password: hashedPassword,
          username: new_username,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          // Throw error if username already exists
          throw new ConflictException(ErrorList.ConflictUser.errorMessage);
        } else {
          // console.log(error);
          throw new InternalServerErrorException();
        }
      });

    // clone the created user
    const userinfos: User = { ...user };

    // modify the password variable to the uuidv4
    userinfos.password = myuuid;

    // return the modified user
    return userinfos;
  }

  /**
   * Delete user from user_id
   * @param id user_id
   * @returns Deleted user
   * @throws User not found
   */
  async delete(id: number): Promise<any> {
    // Delete template by id from prisma
    return await this.prisma.user
      .delete({
        where: {
          user_id: id,
        },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          // Throw error if user not found
          throw new NotFoundException(ErrorList.UserNotFound.errorMessage);
        }
        // console.log(error);
        throw new InternalServerErrorException();
      });
  }
}
