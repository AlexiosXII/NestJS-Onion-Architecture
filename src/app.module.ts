// NestJS Dependencies
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

// Common
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor';
import { ContextInterceptor } from './common/interceptor/context.interceptor';
import { LoggerModule } from './common/logger/logger.module';

// Controller
import { ProductController } from './controller/product/product.controller';

// Module
import { ProductModule } from './module/product/product.module';
import { RequestContextModule } from 'nestjs-request-context';
// ======================================================================================
//                                      readme
//              Before add any constance, Please fill it in it's context.

@Module({
    imports: [
        RequestContextModule,
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 10,
            },
        ]),
        LoggerModule,

        ProductModule,
    ],
    controllers: [ProductController],
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
