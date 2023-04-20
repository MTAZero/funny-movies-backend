import { Injectable } from '@nestjs/common';

const ytdl = require('ytdl-core');

@Injectable()
export class VideoSharesService {
    async getVideoInfo(url: string) {
        const ans = await ytdl.getInfo(url);

        let res = {
            title: ans?.videoDetails?.title,
            description: ans?.videoDetails?.description,
        };

        return res;
    }
}
