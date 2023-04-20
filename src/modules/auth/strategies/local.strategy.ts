import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    @Inject(AuthService)
    authService: AuthService;

    constructor(){
        super({
            usernameField: 'email'
        })
    }

    async validate(email: string, password: string): Promise<any> {
        let result = await this.authService.validateUser(email, password);

        if (!result.isValidate) throw new UnauthorizedException();

        return result.user;
    }
}
