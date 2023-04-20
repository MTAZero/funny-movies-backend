import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PaginationConstants } from 'src/const';

@Injectable()
export class SortMiddleware implements NestMiddleware {
    async use(req: any, res: any, next: NextFunction) {
        let sort = req.query.sort ? req.query.sort : {};
        let ans: any = {};

        let ok = 0;
        for (let key in sort) {
            if (sort[key] == 'des') {
                ans[key] = -1;
                ok = 1;
            }
            if (sort[key] == 'asc') {
                ans[key] = 1;
                ok = 1;
            }
        }

        if (ok) req.sort = ans;

        return next();
    }
}
