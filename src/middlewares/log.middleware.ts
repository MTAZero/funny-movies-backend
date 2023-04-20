import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ResponseCode, ResponseMessage } from 'src/const/response';
import { ResponseToClient } from 'src/utils';
import { Types } from 'mongoose';

let ObjectId = Types.ObjectId;

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    logger = new Logger();

    use(req: any, res: Response, next: NextFunction) {
        try {
            // const date = new Date();
            res.on('finish', () => {
                // let user_id = req.user ? new ObjectId(req.user._id) : null;

                // const obj = {
                //     user_id: user_id,
                //     method: req.method,
                //     protocol: req.protocol,
                //     path: req.path,
                //     ip: req.ip,
                //     duration: new Date().getTime() - date.getTime(),
                //     status: res.statusCode,
                // };

                // this.logFactoryService.insert(obj);
                this.logger.debug(
                    `User gọi API IP: ${req.ip}, url: ${req.originalUrl}. Kết quả: ${res.statusCode}`,
                );
            });
            return next();
        } catch (error) {
            return ResponseToClient(
                res,
                false,
                ResponseCode.ERROR,
                ResponseMessage.ERROR,
                'Log save error',
            );
        }
    }
}
