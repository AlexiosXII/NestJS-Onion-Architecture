// NestJS Dependencies
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { RequestContextModule } from 'nestjs-request-context';

// Common
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { ContextInterceptor } from './common/interceptors/context.interceptor';
import { LoggerModule } from './common/logger/logger.module';

// Module
import { UserModule } from './external/api/user/user.module';
import { AuthModule } from './external/api/auth/auth.module';

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
        AuthModule,
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
