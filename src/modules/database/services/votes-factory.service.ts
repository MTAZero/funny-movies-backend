import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseFactoryService } from './base-services';
import { tbl_users, tbl_votes } from '../schemas';

@Injectable()
export class VoteFactoryService extends BaseFactoryService<tbl_users> {
    constructor(@InjectModel(tbl_votes.name) private readonly vote_model) {
        super(vote_model);
    }
}
