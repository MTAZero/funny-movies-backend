import { Test, TestingModule } from '@nestjs/testing';
import { VideoSharesService } from './video-shares.service';

describe('VideoSharesService', () => {
    let service: VideoSharesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VideoSharesService],
        }).compile();

        service = module.get<VideoSharesService>(VideoSharesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Get Video Info', async () => {
        let ans = await service.getVideoInfo(
            'https://www.youtube.com/watch?v=6NtTCf13toE',
        );

        const res = {
            title: 'Kung Fu Panda ĐỈNH như thế nào?',
            description:
                'Kung Fu Panda ĐỈNH như thế nào?\n' +
                '\n' +
                'Đây không phải review phim hay tóm tắt phim!',
        };

        expect(ans.title).toEqual(res.title);
        expect(ans.description).toEqual(res.description);
    });
});
