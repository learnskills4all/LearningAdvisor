import { Body, Controller, Get, Param, Put, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { query } from 'express';
import { ChangepasswordDto } from 'src/changepassword/dto/changepassword.dto';
import { ChangepasswordService } from './changepassword.service'

@Controller('changepassword')
@ApiTags('changepassword')
export class ChangepasswordController {
    constructor (private changepasswordService: ChangepasswordService) {}

    @Put('/putByUserName') 
    @ApiOkResponse({ description: 'Password changed successfully' })
    @ApiUnauthorizedResponse({ description: 'incorrect password' })
    public async putByUserName (
        @Body() changepasswordDto: ChangepasswordDto,
        @Req() req,
        ) {
        const currentPasswordName = changepasswordDto.currentPassword;
        const newPasswordName = changepasswordDto.newPassword;
        const calluser = req.user.user_id;
        return await this.changepasswordService.putChangePasswordByUserName(
            currentPasswordName,
            newPasswordName,
            calluser,
            )
    }
}