import { Module } from '@nestjs/common';
import { VideoSharesController } from './video-shares.controller';
import { DatabaseModule } from '../database/database.module';
import { VideoSharesService } from './video-shares.service';

@Module({
    imports: [DatabaseModule],
    controllers: [VideoSharesController],
    providers: [VideoSharesService],
})
export class VideoSharesModule {}
