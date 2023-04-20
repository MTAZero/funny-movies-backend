import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseFactoryService } from './base-services';
import { tbl_users, tbl_video_shares } from '../schemas';

@Injectable()
export class VideoShareFactoryService extends BaseFactoryService<tbl_users> {
    constructor(@InjectModel(tbl_video_shares.name) private readonly video_share_model) {
        super(video_share_model);
    }
}
