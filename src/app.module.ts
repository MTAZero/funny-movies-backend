import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
    LoggerMiddleware,
    PaginationMiddleware,
    SortMiddleware,
} from './middlewares';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { VideoSharesModule } from './modules/video-shares/video-shares.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.CONNECT_STRING),
        AuthModule,
        DatabaseModule,
        VideoSharesModule,
    ],
    controllers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('/');
        consumer.apply(PaginationMiddleware).forRoutes('/');
        consumer.apply(SortMiddleware).forRoutes('/');
    }
}
