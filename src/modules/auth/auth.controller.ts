import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Inject,
    Post,
    Put,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { ResponseCode, ResponseMessage } from 'src/const/response';
import { CurrentUser } from 'src/decorator/common.decorator';
import { currentUser } from 'src/decorator/common/current_user';
import { ResponseToClient } from 'src/utils';
import { UserFactoryService } from '../database/services';
import { AuthService } from './auth.service';

import { JwtAuthGuard, LocalAuthGuard } from './guards';

import { LoginInput } from './dto/login.dto';
import { RegisterInput } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    @Inject(AuthService)
    authService: AuthService;

    @Inject(UserFactoryService)
    userService: UserFactoryService;

    @ApiTags('Auth')
    @ApiBody({
        type: LoginInput,
    })
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@CurrentUser() user: currentUser, @Res() res) {
        const ans = await this.authService.signTokenByUser(user);

        return ResponseToClient(
            res,
            true,
            ResponseCode.SUCCESS,
            ResponseMessage.SUCCESS,
            ans,
        );
    }

    @ApiTags('Auth')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('/my-info')
    async getMyInfo(@CurrentUser() user: currentUser, @Res() res) {
        const result = await this.userService.getItemById(user._id);

        return ResponseToClient(
            res,
            true,
            ResponseCode.SUCCESS,
            ResponseMessage.SUCCESS,
            result,
        );
    }

    @ApiTags('Auth')
    @ApiBody({
        type: RegisterInput,
    })
    @Post('/register')
    async register(@Res() res, @Body() user: RegisterInput) {
        const new_user = {
            ...user,
            ...{
                status: 'active'
            }
        }

        const temp = await this.userService.insert(new_user);
        const ans = await this.authService.signTokenByUser(temp);

        return ResponseToClient(
            res,
            true,
            ResponseCode.SUCCESS,
            ResponseMessage.SUCCESS,
            ans,
        );
    }
}
