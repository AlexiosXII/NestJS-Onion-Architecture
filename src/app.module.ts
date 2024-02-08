// NestJS Dependencies
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

// Common
import { RequestContextMiddleware } from './common/middleware/request-context';
import { RequestContextProvider } from './common/module/request-context.ts/context.service';
import { LoggerModule } from './common/module/logger/logger.module';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor';

// Controller
import { ProductController } from './controller/product/product.controller';

// Module
import { ProductModule } from './module/product/product.module';
// ======================================================================================
//                                      readme
//              Before add any constance, Please fill it in it's context.

@Module({
    imports: [
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
            useClass: ResponseInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TimeoutInterceptor,
        },
        RequestContextProvider,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(RequestContextMiddleware).forRoutes('*');
    }
}
