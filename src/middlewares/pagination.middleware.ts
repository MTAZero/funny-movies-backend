import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PaginationConstants, PaginationQuery } from 'src/const';

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
    // logger = new Logger();

    async use(req: any, res: any, next: NextFunction) {
        let pageSize = req.query.pageSize
            ? req.query.pageSize
            : PaginationConstants.default_size;
        let pageIndex = req.query.pageIndex
            ? req.query.pageIndex
            : PaginationConstants.default_index;

        let page = parseInt(pageIndex.toString());
        let size = parseInt(pageSize.toString());
        let offset = size * (page - 1);

        const pagination: PaginationQuery = {
            page,
            size,
            offset,
        };
        req.pagination = pagination;

        return next();
    }
}
