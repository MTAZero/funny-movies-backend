import {
    Body,
    Controller,
    Get,
    Inject,
    NotFoundException,
    Param,
    Post,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    VideoShareFactoryService,
    VoteFactoryService,
} from '../database/services';
import { VideoShareInput } from './dto/video-share.input';
import { JwtAuthGuard } from '../auth/guards';
import { ApiTags, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import {
    PaginateParam,
    PaginationQuery,
    ResponseCode,
    ResponseMessage,
} from 'src/const';
import { CurrentUser, Pagination } from 'src/decorator/common.decorator';
import { VideoSharesService } from './video-shares.service';
import { ResponseToClient } from 'src/utils';
import { currentUser } from 'src/decorator/common/current_user';

@Controller('video-shares')
export class VideoSharesController {
    @Inject(VideoShareFactoryService)
    videoShareFactoryService: VideoShareFactoryService;

    @Inject(VoteFactoryService)
    voteFactoryService: VoteFactoryService;

    @Inject(VideoSharesService)
    videoShareService: VideoSharesService;

    @ApiTags('Share-Video')
    @ApiBody({
        type: VideoShareInput,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('')
    async CreateNewShareVideo(
        @Res() res,
        @Body() video: VideoShareInput,
        @CurrentUser() user: currentUser,
    ) {
        const info = await this.videoShareService.getVideoInfo(video.url);

        const video_share = {
            ...info,
            ...{
                share_by: user._id,
                url: video.url,
            },
        };

        const ans = await this.videoShareFactoryService.insert(video_share);

        return ResponseToClient(
            res,
            true,
            ResponseCode.SUCCESS,
            ResponseMessage.SUCCESS,
            ans,
        );
    }

    @ApiTags('Share-Video')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('')
    async GetListShareVideo(
        @Res() res,
        @Query() query: PaginateParam,
        @Pagination() pagination: PaginationQuery,
    ) {
        let textSearch: string = query.keyword ? query.keyword : '';

        let data = await this.videoShareFactoryService.getItemsByFilter(
            {},
            pagination.offset,
            pagination.size,
            {},
            textSearch,
        );

        return ResponseToClient(
            res,
            true,
            ResponseCode.SUCCESS,
            ResponseMessage.SUCCESS,
            data,
        );
    }

    @ApiTags('Share-Video')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: 'String', required: true })
    @UseGuards(JwtAuthGuard)
    @Post('/like/:id')
    async LikeVoteVideo(
        @Res() res,
        @Param('id') id: string,
        @CurrentUser() user: currentUser,
    ) {
        let ans;

        const share_video = await this.videoShareFactoryService.getItemById(id);
        if (!share_video) throw new NotFoundException();

        const vote = await this.voteFactoryService.getFirstItemByFilter({
            user: user._id,
            video: share_video._id,
        });

        if (!vote) {
            let entity = {
                user: user._id,
                video: share_video._id,
                vote_value: 1,
                status: 'active',
            };

            ans = await this.voteFactoryService.insert(entity);
        } else {
            ans = await this.voteFactoryService.update(vote._id, {
                vote_value: 1,
            });
        }

        return ResponseToClient(
            res,
            true,
            ResponseCode.SUCCESS,
            ResponseMessage.SUCCESS,
            ans,
        );
    }

    @ApiTags('Share-Video')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: 'String', required: true })
    @UseGuards(JwtAuthGuard)
    @Post('/dislike/:id')
    async DislikeVoteVideo(@Res() res, @Param('id') id: string, @CurrentUser() user: currentUser,) {
        let ans;

        const share_video = await this.videoShareFactoryService.getItemById(id);
        if (!share_video) throw new NotFoundException();

        const vote = await this.voteFactoryService.getFirstItemByFilter({
            user: user._id,
            video: share_video._id,
        });

        if (!vote) {
            let entity = {
                user: user._id,
                video: share_video._id,
                vote_value: -1,
                status: 'active',
            };

            ans = await this.voteFactoryService.insert(entity);
        } else {
            ans = await this.voteFactoryService.update(vote._id, {
                vote_value: -1,
            });
        }

        return ResponseToClient(
            res,
            true,
            ResponseCode.SUCCESS,
            ResponseMessage.SUCCESS,
            ans,
        );
    }
}
