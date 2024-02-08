import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextProvider } from '../module/request-context.ts/context.service';
import * as httpContext from 'express-http-context';
import { v4 as uuidv4 } from 'uuid';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import winston = require('winston');
import { RequestContextKeys } from '../module/request-context.ts/context.enum';

/**
 * Middleware that sets up the request context for each incoming request.
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
    constructor(
        private requestContextProvider: RequestContextProvider,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: winston.Logger,
    ) {}

    /**
     * Handles the incoming request and sets up the request context.
     * @param req The incoming request object.
     * @param res The outgoing response object.
     * @param next The next function to be called in the middleware chain.
     */
    use(req: Request, res: Response, next: NextFunction): void {
        this.logger.info(`${req.method} - ${JSON.stringify(req.originalUrl)}`);
        httpContext.middleware(req, res, () => {
            const uuid: string =
                req.headers['requestId'] ||
                req.headers['requestid'] ||
                uuidv4();
            req.headers['requestId'] = uuid;
            this.requestContextProvider.set(
                RequestContextKeys.REQUEST_ID,
                uuid,
            );
            res.setHeader('requestId', uuid);
            next();
        });
    }
}
