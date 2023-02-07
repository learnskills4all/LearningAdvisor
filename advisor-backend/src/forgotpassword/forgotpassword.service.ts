import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { type } from 'os';
import { ErrorList } from 'src/errorTexts';


@Injectable()
export class ForgotpasswordService {

    constructor(
                private readonly prismaService: PrismaService,
                private  mailService: MailerService,
                private jwtService: JwtService,
                ) {}
    
    public async postSendEmail(
        username: string, 
        email: string,
        ): Promise<any> {
            const user = await this.prismaService.user
            .findUnique({
                where: {
                    username: username
                }
            })
            if (!user) {
                throw new NotFoundException(ErrorList.UserNotFound.errorMessage);
              }
            // creating a link valid for 15 min
            const payload = {
                id: user.user_id,
            }
            const token = this.jwtService.sign(payload, {secret: process.env.JWT_SECRET, expiresIn: '15m'})
            const encodedToken = Buffer.from(token).toString('base64')
            const url = process.env.APP_URL + `/validation/${user.user_id}/${encodedToken}`

            return await this.mailService.sendMail({
                to: email,
                from: 'NoReply@testingAdvisor',
                subject: 'Reset Password TestAdvisor',
                text:`Please click on the following link to reset your password: ${url}`,
            });
        }

        public async getValidated(
            id: any,
            token: string,
        ): Promise<any> {
            const userId = parseInt(id);
            const user = await this.prismaService.user
            .findUnique({
                where: {
                    user_id: userId
                }
            }) 
            if (userId!==user.user_id) {
                throw new NotFoundException(ErrorList.UserNotFound.errorMessage);
            }
            let payload;
            const decodedToken = Buffer.from(token, 'base64').toString('utf-8')
            try {
                payload = this.jwtService.verify(decodedToken)

            } catch (error) {
                throw new BadRequestException(ErrorList.BadToken.errorMessage);
            }
            if (payload.id !== userId) {
                throw new UnauthorizedException(ErrorList.NotAuthorizedUser.errorMessage)
            }
            return true;
        }


        public async patchPass(
            id: any,
            newPassword: string,
            token: any,
            ): Promise<any> {
            const userId = parseInt(id);
            const user = await this.prismaService.user
            .findUnique({
                where: {
                    user_id: userId
                }
            }) 
            if (userId!==user.user_id) {
                throw new NotFoundException(ErrorList.UserNotFound.errorMessage);
            }
            let payload;
            const decodedToken = Buffer.from(token, 'base64').toString('utf-8')
            try{
            payload = this.jwtService.verify(decodedToken)
            } catch (err) {
                throw new UnauthorizedException(ErrorList.BadToken.errorMessage)
            }
            if (payload.id !== userId) {
                throw new UnauthorizedException(ErrorList.NotAuthorizedUser.errorMessage)
            }

            const salt = 10;
            const hashedPassword = await bcrypt.hash(newPassword, salt);

                      
            return await this.prismaService.user.update({
              where: {
                  user_id: userId,
              },
              data: {
                  password: hashedPassword,
              }
          })
    }
}
