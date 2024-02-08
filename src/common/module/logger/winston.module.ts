import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ContextModule } from '../request-context.ts/context.module';

@Module({
    imports: [
        WinstonModule.forRootAsync({
            imports: [ContextModule],
            useFactory: () => ({
                exitOnError: false,
                levels: winston.config.syslog.levels,
                format: winston.format.combine(
                    winston.format.label({ label: 'main' }),
                    winston.format.timestamp(),
                    winston.format.json(),
                ),
                transports: [
                    new winston.transports.Console({
                        format: winston.format.combine(
                            winston.format.label({ label: 'main' }),
                            winston.format.timestamp(),
                            winston.format.printf(
                                (info) =>
                                    `${info.timestamp} ${info.label} [${info.level}]: ${info.message}`,
                            ),
                        ),
                    }),
                ],
            }),
        }),
    ],
})
export class WinstonCustomModule {}
