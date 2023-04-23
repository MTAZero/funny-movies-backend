import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseFactoryService } from './base-services';
import * as bcrypt from 'bcrypt';
import { ResponseCode } from 'src/const/response';
import { tbl_users } from '../schemas';

@Injectable()
export class UserFactoryService extends BaseFactoryService<tbl_users> {
    constructor(@InjectModel(tbl_users.name) private readonly userModel) {
        super(userModel);
    }

    async insert(entity: any): Promise<any> {
        let cnt = await this.userModel
            .find({ email: entity.email })
            .countDocuments();
        if (cnt > 0) throw new BadRequestException('Already exits');

        entity.created_date = new Date().getTime();
        entity.last_update = new Date().getTime();

        entity.password_hash = await bcrypt.hash(entity.password, 10);

        const _entity = new this.userModel(entity);
        await _entity.save();

        const ans = await this.userModel.findById(_entity._id, {
            password_hash: 0,
        });

        return ans;
    }
}
