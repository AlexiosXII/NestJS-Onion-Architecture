import * as httpContext from 'express-http-context';
import { RequestContextKeys } from '../module/request-context.ts/context.enum';

/**
 * Decorator that adds method tracing functionality to a class method.
 * It logs the method call with arguments and request ID before invoking the original method,
 * and logs the method return value after the original method is executed.
 * @returns The decorated method.
 */
export const MethodTracer =
    () =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const requestId = httpContext.get(RequestContextKeys.REQUEST_ID);
            const className = target.constructor.name;
            if (!this.logger) {
                throw new Error(
                    `Using logger in @MethodTracer, please declare logger in class constructor [${className}]\nExample:\nconstructor(\n    @Inject(WINSTON_MODULE_PROVIDER)\n    private readonly logger: winston.Logger,\n) {}`,
                );
            }
            const logger = this.logger;
            logger.info(
                `Calling method [${className}.${propertyKey}] with arguments: ${JSON.stringify(
                    args,
                )} and requestId: ${requestId}`,
            );
            // Start tracer here
            // *
            // *
            const result = originalMethod.apply(this, args);
            logger.info(
                `Method ${className}.${propertyKey} returned: ${JSON.stringify(
                    result,
                )}`,
            );
            // End tracer here
            // *
            // *
            return result;
        };
        return descriptor;
    };
