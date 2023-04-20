import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { tbl_users } from './tbl_users';
import { tbl_video_shares } from './tbl_video_shares';

@Schema()
export class tbl_votes extends Document<any> {
    _id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: tbl_users.name })
    user: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: tbl_video_shares.name })
    video: Types.ObjectId;

    @Prop()
    vote_value: number;

    @Prop()
    last_update: number;

    @Prop()
    created_date: number;

    @Prop()
    status: string;
}

export const tbl_votes_schema = SchemaFactory.createForClass(tbl_votes);
