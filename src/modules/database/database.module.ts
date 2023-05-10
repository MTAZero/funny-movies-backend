import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    tbl_comment_schema,
    tbl_comments,
    tbl_users,
    tbl_users_schema,
    tbl_video_shares,
    tbl_video_shares_schema,
    tbl_votes,
    tbl_votes_schema,
} from './schemas';
import {
    CommentFactoryService,
    UserFactoryService,
    VideoShareFactoryService,
    VoteFactoryService,
} from './services';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: tbl_users.name,
                schema: tbl_users_schema,
            },
            {
                name: tbl_video_shares.name,
                schema: tbl_video_shares_schema,
            },
            {
                name: tbl_votes.name,
                schema: tbl_votes_schema,
            },
            {
                name: tbl_comments.name,
                schema: tbl_comment_schema,
            },
        ]),
    ],
    providers: [
        UserFactoryService,
        VideoShareFactoryService,
        VoteFactoryService,
        CommentFactoryService,
    ],
    exports: [
        UserFactoryService,
        VideoShareFactoryService,
        VoteFactoryService,
        CommentFactoryService,
    ],
})
export class DatabaseModule {}
