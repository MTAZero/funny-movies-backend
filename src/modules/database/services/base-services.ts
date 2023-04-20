import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { IDbFactory } from 'src/interface';

@Injectable()
export class BaseFactoryService<T extends Document> implements IDbFactory<T> {
    constructor(private readonly model: Model<T>) {}

    async getItemsByFilter(
        filter: object = {},
        skip: number = 0,
        limit: number = 10,
        sort: any = {},
        textsearch: any = '',
    ): Promise<any> {
        if (textsearch != '')
            filter = {
                ...filter,
                ...{
                    $text: {
                        $search: `"${textsearch}"`,
                    },
                },
            };

        let ans = await this.model
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean()
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

    async getFirstItemByFilter(
        filter: object = {},
        skip: number = 0,
        sort: any = {},
        textsearch: any = '',
    ): Promise<any> {
        if (textsearch != '')
            filter = {
                ...filter,
                ...{
                    $text: {
                        $search: `"${textsearch}"`,
                    },
                },
            };

        let ans = await this.model
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(1)
            .lean()
            .exec();

        if (!ans[0]) return null;

        return ans[0];
    }

    async getItemById(id: any): Promise<any> {
        return this.model.findById(id).lean().exec();
    }

    async update(id: any, entity: any): Promise<any> {
        entity.last_update = new Date().getTime();

        await this.model
            .updateOne(
                {
                    _id: id,
                },
                entity,
            )
            .exec();
        let ans = await this.model.findById(id);

        return ans;
    }

    async updateManyByFilter(filter: any = {}, entity: any) {
        entity.last_update = new Date().getTime();

        let ans = await this.model.updateMany(filter, entity);
        return ans;
    }

    async remove(id: any): Promise<boolean> {
        try {
            await this.model
                .deleteOne({
                    _id: id,
                })
                .exec();

            return true;
        } catch (ex: any) {
            return false;
        }
    }

    async insert(entity: any): Promise<any> {
        entity.created_date = new Date().getTime();
        entity.last_update = new Date().getTime();

        const _entity = new this.model(entity);
        return _entity.save();
    }

    async countByFilter(filter) {
        let ans = await this.model.find(filter).countDocuments();
        return ans;
    }

    async insertMany(entitys: Array<any>): Promise<any> {
        let promises = [];

        for (let index = 0; index < entitys.length; index++) {
            entitys[index].created_date = new Date().getTime();
            entitys[index].last_update = new Date().getTime();

            let promise = new Promise(async (resolve, reject) => {
                try {
                    await this.insert(entitys[index]);
                    resolve(true);
                } catch (ex) {
                    reject(ex);
                }
            });

            promises.push(promise);
        }

        return await Promise.all(promises);
    }
}
