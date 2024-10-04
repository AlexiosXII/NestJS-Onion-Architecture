// NestJS Dependencies
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { RequestContextModule } from 'nestjs-request-context';

// Common
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor';
import { ContextInterceptor } from './common/interceptor/context.interceptor';
import { LoggerModule } from './common/logger/logger.module';

// Module
import { UserModule } from './api/user/user.module';

@Module({
    imports: [
        // global modules
        RequestContextModule,
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 10,
            },
        ]),
        LoggerModule,

        // application modules
        UserModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ContextInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TimeoutInterceptor,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // No additional middleware configuration needed if using isGlobal: true
    }
}
