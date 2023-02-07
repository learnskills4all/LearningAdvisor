import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import AuthUser from '../common/decorators/auth-user.decorator';
import { User } from '.prisma/client';
import { CreateUserDto } from './dto/register-user.dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CookieOptions, Response } from 'express';
import { ProfileDto } from '../user/dto/profile.dto';
import { Unauthorized } from '../common/decorators/unauthorized.decorator';

// Cookie options
const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
};

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * [POST] /login
   * @param loginDto login information
   * @returns string message
   */
  @Post('/login')
  @ApiOkResponse({ description: 'login successful' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiUnauthorizedResponse({ description: 'incorrect password' })
  @Unauthorized()
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = (await this.authService.login(loginDto)).token;
    const secretData = {
      token,
      refreshToken: '',
    };

    res.cookie('token', secretData, cookieOptions);
    return { msg: 'login successful' };
  }

  /**
   * [POST] /register
   * @param createUserDto information for creating a user
   * @returns registration response
   */
  @Post('/register')
  @ApiResponse({
    description: 'Registered',
    type: LoginDto,
  })
  @Unauthorized()
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const register = await this.authService.register(createUserDto);

    const token = register.token;
    const user = register.user;

    const secretData = {
      token,
      refreshToken: '',
    };

    res.cookie('token', secretData, cookieOptions);
    return { username: user.username, password: user.password };
  }

  /**
   * [POST] /logout
   * @returns a response which clears browser cookies
   */
  @Post('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token', cookieOptions).send({ msg: 'logout successful' });
  }

  /**
   * [GET] /profile
   * @param user
   * @returns user
   */
  @Get('/profile')
  @ApiResponse({
    description: 'Found user',
    type: ProfileDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getLoggedUser(@AuthUser() user: User): User {
    return user;
  }
}
