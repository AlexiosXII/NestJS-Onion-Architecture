import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import * as httpContext from 'express-http-context';
import { RequestContextKeys } from '../module/request-context.ts/context.enum';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import winston from 'winston';

/**
 * Interceptor that handles the response of HTTP requests.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: winston.Logger,
    ) {}

    /**
     * Intercepts the response of an HTTP request.
     * @param context - The execution context of the request.
     * @param next - The next call handler.
     * @returns An observable of the response.
     */
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const now = Date.now();
        return next.handle().pipe(
            map((result) => {
                if (result?.custom === true) {
                    return result.data;
                }
                const requestId = httpContext.get(
                    RequestContextKeys.REQUEST_ID,
                );
                const res = {
                    requestId: requestId,
                    statusCode: StatusCodes.OK,
                    message: getReasonPhrase(StatusCodes.OK),
                    data: result === undefined ? {} : result,
                };
                this.logger.info(`Time execute ${Date.now() - now}ms`);
                this.logger.info(`Response ${JSON.stringify(res)}`);
                return res;
            }),
            catchError((error) => {
                if (!error?.response?.error) {
                    this.logger.error('UNEXPECTED ERROR => ', error, '\n');
                }
                throw error;
            }),
        );
    }
}
