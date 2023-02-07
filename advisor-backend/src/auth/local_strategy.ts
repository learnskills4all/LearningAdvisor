import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ErrorList } from 'src/errorTexts';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Verify the user information
   * @param username username
   * @param password password
   * @returns user
   * @throws incorrect details
   */
  async validate(username: string, password: string) {
    const user = (await this.authService.login({ username, password })).user;
    console.log(user);
    if (user == null) {
      console.log('got in');
      throw new UnauthorizedException(ErrorList.LoginNotAuthorized.errorMessage);
    }
    return user;
  }
}
