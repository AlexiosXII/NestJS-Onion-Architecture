import { Injectable } from '@nestjs/common';
import * as httpContext from 'express-http-context';

/**
 * Provides methods to get and set values in the request context.
 */
@Injectable()
export class RequestContextProvider {
    /**
     * Retrieves the value associated with the specified key from the request context.
     * @param key - The key of the value to retrieve.
     * @returns The value associated with the specified key.
     */
    get(key: string): string {
        return httpContext.get(key);
    }

    /**
     * Sets the value associated with the specified key in the request context.
     * @param key - The key of the value to set.
     * @param value - The value to set.
     */
    set(key: string, value: unknown): void {
        return httpContext.set(key, value);
    }
}
