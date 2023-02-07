import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '../../node_modules/@nestjs/passport';
import { JwtModule } from '../../node_modules/@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local_strategy';

// all modules needed for authentication
@Module({
  imports: [
    UserModule,
    // jwt library
    PassportModule,
    JwtModule.register({
      // points to jwt secret used to generate jwt tokens
      secret: process.env.JWT_SECRET,

      // points to the value showing the amount of time until the jwt token expires
      signOptions: {
        expiresIn: process.env.EXPIRESIN,
      },
    }),
  ],
  // providers, controllers and exports used in authentication
  providers: [AuthService, PrismaService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
