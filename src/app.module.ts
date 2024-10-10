// NestJS Dependencies
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { RequestContextModule } from 'nestjs-request-context';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    AcceptLanguageResolver,
    HeaderResolver,
    I18nModule,
    QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';

// Common
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { ContextInterceptor } from './common/interceptors/context.interceptor';
import { LoggerModule } from './common/logger/logger.module';
import { ErrorResponseInterceptor } from './common/interceptors/error-response.interceptor';
import { SuccessResponseInterceptor } from './common/interceptors/success-response.interceptor';

// Module
import { UserModule } from './external/api/user/user.module';
import { AuthModule } from './external/api/auth/auth.module';

@Module({
    imports: [
        // Add ConfigModule before I18nModule
        ConfigModule.forRoot({
            isGlobal: true, // Makes ConfigModule global
        }),
        // global modules
        RequestContextModule,
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 10,
            },
        ]),
        I18nModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                fallbackLanguage: 'en',
                loaderOptions: {
                    path: join(__dirname, '/i18n/'),
                    watch: true,
                },
            }),
            resolvers: [
                { use: QueryResolver, options: ['lang'] },
                AcceptLanguageResolver,
                new HeaderResolver(['x-lang']),
            ],
            inject: [ConfigService],
        }),

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
            useClass: TimeoutInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: SuccessResponseInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ErrorResponseInterceptor,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // No additional middleware configuration needed if using isGlobal: true
    }
}
