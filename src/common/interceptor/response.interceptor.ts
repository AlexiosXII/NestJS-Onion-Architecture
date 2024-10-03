import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { RequestContextService } from '../context/app-request-context';

/**
 * Interceptor that handles the response of HTTP requests.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    private readonly logger = new Logger(ResponseInterceptor.name);

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
                const requestId = RequestContextService.getRequestId();
                const res = {
                    meta: {
                        requestId: requestId,
                        statusCode: StatusCodes.OK,
                        message: getReasonPhrase(StatusCodes.OK),
                    },
                    data: result === undefined ? {} : result,
                };
                this.logger.log(`Time execute ${Date.now() - now}ms`);
                this.logger.log(`Response ${JSON.stringify(res)}`);
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
