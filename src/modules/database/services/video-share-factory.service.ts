import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseFactoryService } from './base-services';
import { tbl_users, tbl_video_shares, tbl_votes } from '../schemas';
import { ObjectId } from 'mongoose';

@Injectable()
export class VideoShareFactoryService extends BaseFactoryService<tbl_users> {
    constructor(
        @InjectModel(tbl_video_shares.name) private readonly video_share_model,
    ) {
        super(video_share_model);
    }

    async getUserItemsByFilter(
        userId: string = null,
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

        let ans = await this.video_share_model
            .aggregate([
                {
                    $match: filter,
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
                {
                    $lookup: {
                        from: tbl_votes.name,
                        let: {
                            id: '$_id',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$$id', '$video'],
                                    },
                                },
                            },
                            {
                                $match: {
                                    $expr: {
                                        $eq: [1, '$vote_value'],
                                    },
                                },
                            },
                        ],
                        as: 'likes',
                    },
                },
                {
                    $addFields: {
                        like: { $size: '$likes' },
                    },
                },
                {
                    $unset: 'likes',
                },
                {
                    $lookup: {
                        from: tbl_votes.name,
                        let: {
                            id: '$_id',
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$$id', '$video'],
                                    },
                                },
                            },
                            {
                                $match: {
                                    $expr: {
                                        $eq: [-1, '$vote_value'],
                                    },
                                },
                            },
                        ],
                        as: 'dislikes',
                    },
                },
                {
                    $addFields: {
                        dislike: { $size: '$dislikes' },
                    },
                },
                {
                    $unset: 'dislikes',
                },
            
                {
                    $unset: 'votes',
                },
                {
                    $lookup: {
                        from: tbl_votes.name,
                        let: {
                            id: '$_id',
                            userId: userId,
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$$id', '$video'],
                                    },
                                },
                            },
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$$userId', '$user'],
                                    },
                                },
                            },
                        ],
                        as: 'votes',
                    },
                },
                {
                    $addFields: {
                        your_vote: {
                            $arrayElemAt: ['$votes', 0],
                        },
                    },
                },
                {
                    $unset: 'votes',
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
}
