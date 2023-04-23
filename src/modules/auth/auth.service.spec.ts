import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConstants } from 'src/const';
import { AuthController } from './auth.controller';
import { LocalStrategy, JwtStrategy } from './strategies';

describe('AuthService', () => {
    let service: AuthService;

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

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('check validateUser', async () => {
        let ans = await service.validateUser(
            'buithuy3996@gmail.com',
            '12312312',
        );
        expect(ans.isValidate).toEqual(false);

        let res = await service.validateUser(
            'buithuy3996@gmail.com',
            '123edcxz',
        );
        expect(res.isValidate).toEqual(true);
    });

    it('Intergration check genarate token and verify token', async () => {
        const user = {
            email: "buithuy3996@gmail.com",
            _id: "6440e2e588ba5890ff4e1984"
        }

        let ans = await service.signTokenByUser(user)
        const token = ans.access_token;

        let user2 = await service.getUserByToken(token)
        
        expect(user.email).toEqual(user2.email);
    });
});
