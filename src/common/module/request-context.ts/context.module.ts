import { Module } from '@nestjs/common';
import { RequestContextProvider } from './context.service';

@Module({
    providers: [RequestContextProvider],
    exports: [RequestContextProvider],
})
export class ContextModule {}
