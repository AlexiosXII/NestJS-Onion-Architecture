import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApplicationError } from '../errors/application.error';
import { RequestContextService } from '../context/app-request-context';

@Injectable()
export class ErrorResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                if (error instanceof ApplicationError) {
                    return throwError(
                        () =>
                            new HttpException(
                                {
                                    requestId:
                                        RequestContextService.getRequestId(),
                                    status: 'error',
                                    error: {
                                        code: error.code,
                                        message: error.message,
                                    },
                                },
                                400,
                            ),
                    );
                }
                // Handle other types of errors...
                return throwError(() => error);
            }),
        );
    }
}
