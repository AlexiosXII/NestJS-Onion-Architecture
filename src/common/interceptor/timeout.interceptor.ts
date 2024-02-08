import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    RequestTimeoutException,
} from '@nestjs/common';
import { Observable, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

/**
 * Interceptor that adds a timeout to the request.
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    /**
     * Intercepts the request and adds a timeout.
     * @param context - The execution context.
     * @param next - The call handler.
     * @returns An observable of unknown type.
     */
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        return next.handle().pipe(
            timeout(5000),
            catchError((error) => {
                if (error instanceof TimeoutError) {
                    throw new RequestTimeoutException();
                }
                throw error;
            }),
        );
    }
}
