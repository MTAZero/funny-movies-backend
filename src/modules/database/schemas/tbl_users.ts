import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class tbl_users extends Document<any> {
    _id: Types.ObjectId;

    @Prop()
    email: string;

    @Prop()
    password_hash: string;

    @Prop()
    last_update: number;

    @Prop()
    created_date: number;

    @Prop()
    status: string;
}

export const tbl_users_schema = SchemaFactory.createForClass(tbl_users);

tbl_users_schema.index({
    email: 'text',
    status: 'text'
});
