import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [CommentsController],
})
export class CommentsModule {}
