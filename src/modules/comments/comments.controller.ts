import {
    Body,
    Controller,
    Inject,
    NotFoundException,
    Param,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import {
    CommentFactoryService,
    VideoShareFactoryService,
} from '../database/services';
import { CommentInput } from './dto/comment.input';
import { ApiTags, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorator/common.decorator';
import { currentUser } from 'src/decorator/common/current_user';
import { JwtAuthGuard } from '../auth/guards';
import { ResponseToClient } from 'src/utils';
import { ResponseCode, ResponseMessage } from 'src/const';

@Controller('comments')
export class CommentsController {
    @Inject(CommentFactoryService)
    commentService: CommentFactoryService;

    @Inject(VideoShareFactoryService)
    videoShareFactoryService: VideoShareFactoryService;

    @ApiTags('Comment')
    @ApiBody({
        type: CommentInput,
    })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: 'String', required: true })
    @UseGuards(JwtAuthGuard)
    @Post('/:id')
    async createComment(
        @Res() res,
        @Body() comment: CommentInput,
        @CurrentUser() user: currentUser,
        @Param('id') id: string,
    ) {
        let ans;

        const share_video = await this.videoShareFactoryService.getItemById(id);
        if (!share_video) throw new NotFoundException();

        let newComment = {
            ...comment,
            ...{
                user: user._id,
                video: share_video._id,
                status: 'active',
            },
        };
        ans = await this.commentService.insert(newComment);

        return ResponseToClient(
            res,
            true,
            ResponseCode.SUCCESS,
            ResponseMessage.SUCCESS,
            ans,
        );
    }
}
