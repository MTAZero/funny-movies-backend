import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserFactoryService } from '../database/services';

@Injectable()
export class AuthService {
    @Inject(JwtService)
    jwtService: JwtService;

    @Inject(UserFactoryService)
    userService: UserFactoryService;

    async signTokenByUser(user: any) {
        let payload = {
            email: user.email,
            _id: user._id,
        };

        return {
            user: user,
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(email: string, password: string): Promise<any> {
        try {
            let user = await this.userService.getFirstItemByFilter({
                email: email,
            });
            if (!user)
                return {
                    isValidate: false,
                };

            if (await bcrypt.compare(password, user.password_hash)){
                delete user.password_hash;
                return {
                    isValidate: true,
                    user,
                };
            }

            return {
                isValidate: false,
            };
        } catch (ex: any) {
            return false;
        }
    }

    async getUserByToken(token: string) {
        try {
            let data = await this.jwtService.decode(token);

            let userId = data.sub;
            let user = await this.userService.getItemById(userId);

            return user;
        } catch (ex: any) {
            return null;
        }
    }
}
