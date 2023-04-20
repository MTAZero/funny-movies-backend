import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { tbl_users } from './tbl_users';

@Schema()
export class tbl_video_shares extends Document<any> {
    _id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: tbl_users.name })
    share_by: Types.ObjectId;

    @Prop()
    url: string;

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    last_update: number;

    @Prop()
    created_date: number;

    @Prop()
    status: string;
}

export const tbl_video_shares_schema = SchemaFactory.createForClass(tbl_video_shares);

tbl_video_shares_schema.index({
    url: 'text',
    title: 'text',
    description: 'text'
});
