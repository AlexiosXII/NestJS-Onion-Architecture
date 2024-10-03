import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { RequestContextService } from '../context/app-request-context';

@Module({
    imports: [
        WinstonModule.forRootAsync({
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
                                    `[${info.timestamp}] [${RequestContextService.getRequestId()}] [${info.context}] [${info.level}]: ${info.message}`,
                            ),
                        ),
                    }),
                ],
            }),
        }),
    ],
})
export class WinstonCustomModule {}
