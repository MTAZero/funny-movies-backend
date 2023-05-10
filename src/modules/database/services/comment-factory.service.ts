import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseFactoryService } from './base-services';
import { tbl_comments } from '../schemas';

@Injectable()
export class CommentFactoryService extends BaseFactoryService<tbl_comments> {
    constructor(
        @InjectModel(tbl_comments.name) private readonly comment_model,
    ) {
        super(comment_model);
    }
}
