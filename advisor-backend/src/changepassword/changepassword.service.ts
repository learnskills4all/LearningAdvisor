import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { USERS } from './changepassword.mock';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorList } from 'src/errorTexts';

@Injectable()
export class ChangepasswordService {
    constructor(private readonly prismaService: PrismaService) {}

    public async putChangePasswordByUserName(
        currentPasswordName: string, 
        newPasswordName: string,
        userId: any
        ): Promise<any> {
            //return new Promise(async (resolve) => {
                const user = await this.prismaService.user
                .findUnique({
                    where: {
                      user_id: userId,
                    },
                  })
                // compare the hashes of the given password
                const validatePassword = await bcrypt.compare(currentPasswordName, user.password);
                //try {
                  if (!validatePassword) {
                    throw new UnauthorizedException(ErrorList.WrongPassword.errorMessage);
                    }
                      const salt = 10;
                      const hashedPassword = await bcrypt.hash(newPasswordName, salt);

                      
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
