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
});
