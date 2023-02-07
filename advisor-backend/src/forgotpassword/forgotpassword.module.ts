import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ForgotpasswordController } from './forgotpassword.controller';
import { ForgotpasswordService } from './forgotpassword.service';

@Module({
  imports: [
    // jwt library
    PassportModule,
    JwtModule.register({
      // points to jwt secret used to generate jwt tokens
      secret: process.env.JWT_SECRET,

      // points to the value showing the amount of time until the jwt token expires
      signOptions: {
        expiresIn: process.env.MAIL_EXPIRY,
      },
    }),
  ],
  controllers: [ForgotpasswordController],
  providers: [ForgotpasswordService]
})
export class ForgotpasswordModule {}
