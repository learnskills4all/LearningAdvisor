import { Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Put, Req } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Unauthorized } from 'src/common/decorators/unauthorized.decorator';
import { ForgotpasswordDto } from './dto/forgotpassword.dto';
import { ResetpasswordDto } from './dto/resetpassword.dto';
import { ValidateDataDto } from './dto/validatedata.dto';
import { ForgotpasswordService } from './forgotpassword.service';

@Controller('forgotpassword')
@ApiTags('forgotpassword')
export class ForgotpasswordController {
    constructor (private forgotpasswordService: ForgotpasswordService) {}

    @Post('/postByUserName')
    @ApiOkResponse({ description: 'A reset password email has been sent to given email' })
    @ApiNotFoundResponse({ description: 'user not found' }) 
    @Unauthorized()
    public async postByUserName (
        @Body() forgotpasswordDto: ForgotpasswordDto,
        ) {
        const username = forgotpasswordDto.username;
        const email = forgotpasswordDto.email;
        return await this.forgotpasswordService.postSendEmail(
            username,
            email,
            )
    }

    @Post('/getURLData')
    @Unauthorized()
    public async getURLData (
        @Body() validateDataDTO: ValidateDataDto,
    ) {
        const id = validateDataDTO.urlId;
        const token = validateDataDTO.urlToken;
        return await this.forgotpasswordService.getValidated(
            id,
            token,
        )
    }

    @Patch('/patchByPass')
    @Unauthorized()
    //@ApiOkResponse({ description: 'Password changed Successfully' })
    public async patchByPass (
        @Body() resetpasswordDto: ResetpasswordDto,
        //@Res({ passthrough: true }) res: Response
        ) {
        const newPassword = resetpasswordDto.newPassword;
        const id = resetpasswordDto.userId;
        const token = resetpasswordDto.token;
        return await this.forgotpasswordService.patchPass(
            id,
            newPassword,
            token,
            )
    }
}