import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { RequestContextService } from '../context/app-request-context';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        /**
         * Setting an ID in the global context for each request.
         * This ID can be used as correlation id shown in logs
         */
        const requestId = request?.headers?.requestid || uuidv4();

        RequestContextService.setRequestId(requestId);

        return next.handle().pipe(
            tap(() => {
                // Perform cleaning if needed
            }),
        );
    }
}
