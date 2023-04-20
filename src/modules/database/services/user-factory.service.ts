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

    async getItemsByFilter(
        filter: object = {},
        skip: number = 0,
        limit: number = 10,
        sort: object = { _id: 1 },
        textsearch: string = '',
    ) {
        if (textsearch != '')
            filter = {
                ...filter,
                ...{
                    $text: {
                        $search: `"${textsearch}"`,
                    },
                },
            };

        if (Object.keys(sort).length === 0)
            sort = {
                _id: 1,
            };

        let ans = await this.userModel
            .aggregate([
                {
                    $match: filter,
                },
                {
                    $project: {
                        password: 0,
                    },
                },
                {
                    $sort: sort,
                },
                {
                    $skip: skip,
                },
                {
                    $limit: limit,
                },
            ])
            .exec();

        let total = await this.countByFilter(filter);
        let pageIndex = skip / limit + 1;

        return {
            items: ans,
            total: total,
            size: limit,
            page: pageIndex,
            offset: skip,
        };
    }

    async getItemById(id: any): Promise<any> {
        return this.userModel.findById(id, { password_hash: 0 }).lean().exec();
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

    async update(id: any, entity: any): Promise<any> {
        entity.last_update = new Date().getTime();

        await this.userModel
            .updateOne(
                {
                    _id: id,
                },
                entity,
            )
            .exec();
        let ans = await this.userModel.findById(id, { password_hash: 0 });

        return ans;
    }

    async adminResetPassword(id: any, password: any = ''): Promise<Boolean> {
        let user = await this.userModel.findById(id).exec();
        if (!user) throw new HttpException('Not Found', ResponseCode.ERROR);

        try {
            user.password_hash = await bcrypt.hash(password, 10);

            await this.update(id, user);
            return true;
        } catch (ex: any) {
            console.log('UserFactory adminResetPassword Error : ', ex.message);
            return false;
        }
    }
}
