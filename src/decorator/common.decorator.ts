import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { currentUser } from './common/current_user';

export const Pagination = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<any>();

    return request.pagination;
});

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<any>();

    const ans = request.user;
    return ans;
});

export const CurrentBot = createParamDecorator((_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<any>();

    const ans = request.user;
    return ans;
});
