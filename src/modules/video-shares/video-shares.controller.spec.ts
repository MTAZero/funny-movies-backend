import { Test, TestingModule } from '@nestjs/testing';
import { VideoSharesController } from './video-shares.controller';

describe('VideoSharesController', () => {
  let controller: VideoSharesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoSharesController],
    }).compile();

    controller = module.get<VideoSharesController>(VideoSharesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
