import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/const';
import { JwtStrategy, LocalStrategy } from './strategies';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
    let controller: AuthController;

    const user = {
        email: 'buithuy3996@gmail.com',
        _id: '6440e2e588ba5890ff4e1984',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(process.env.CONNECT_STRING),
                DatabaseModule,
                PassportModule,

                JwtModule.register({
                    secret: jwtConstants.secret,
                    signOptions: {
                        expiresIn: '1d',
                    },
                }),
            ],
            controllers: [AuthController],
            providers: [AuthService, LocalStrategy, JwtStrategy],
            exports: [AuthService],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('login', async () => {
        const res = {
            json: (body?: any) => {},
            status: (code: number) => {
                return {
                    send: (value: any) => {
                        return value;
                    },
                };
            },
        };

        let ans = await controller.login(user, res);

        expect(ans.input_correct).toEqual(true);
        expect(ans.data.user).toBeDefined();
        expect(ans.data.user.email).toEqual('buithuy3996@gmail.com');
    });
});
