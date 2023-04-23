import { Test, TestingModule } from '@nestjs/testing';
import { VideoSharesController } from './video-shares.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../database/database.module';
import { VideoSharesService } from './video-shares.service';

describe('VideoSharesController', () => {
    let controller: VideoSharesController;

    const user = {
        email: 'buithuy3996@gmail.com',
        _id: '6440e2e588ba5890ff4e1984',
    };
    const video_id = '644100dbcb71cc05b2b856c7'

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(process.env.CONNECT_STRING),
                DatabaseModule,
            ],
            controllers: [VideoSharesController],
            providers: [VideoSharesService],
        }).compile();

        controller = module.get<VideoSharesController>(VideoSharesController);
    });

    it('should be defined', async () => {
        expect(controller).toBeDefined();
    });

    it('get List video', async () => {
        const res = {
            json: (body?: any) => {},
            status: (code: number) => {
                return {
                    send: (value: any) => {
                        return value;
                    },
                };
            },
        };

        let ans = await controller.GetPublicListShareVideo(
            res,
            { pageSize: 10, pageIndex: 1, keyword: '' },
            { offset: 0, size: 10, page: 1 },
        );

        expect(ans.input_correct).toEqual(true);
        expect(ans.data).toBeDefined();
        expect(ans.data.items).toBeDefined();
        expect(ans.data.items.length).toBeLessThan(10);
    });

    it('Like video', async () => {
        const res = {
            json: (body?: any) => {},
            status: (code: number) => {
                return {
                    send: (value: any) => {
                        return value;
                    },
                };
            },
        };

        let ans = await controller.LikeVoteVideo(
            res,
            video_id,
            user,
        );

        expect(ans.input_correct).toEqual(true);
        expect(ans.data).toBeDefined();
    });

    it('Dislike video', async () => {
        const res = {
            json: (body?: any) => {},
            status: (code: number) => {
                return {
                    send: (value: any) => {
                        return value;
                    },
                };
            },
        };

        let ans = await controller.DislikeVoteVideo(
            res,
            video_id,
            user,
        );

        expect(ans.input_correct).toEqual(true);
        expect(ans.data).toBeDefined();
    });
});
