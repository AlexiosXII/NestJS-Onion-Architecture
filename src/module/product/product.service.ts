import { Inject, Injectable } from '@nestjs/common';
import { Product } from './product.interface';
import { MethodTracer } from 'src/common/decorator/method-tracer.decorator';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import winston from 'winston';

@Injectable()
export class ProductService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: winston.Logger,
    ) {}

    @MethodTracer()
    getProduct(id: number): Product {
        return { id: 1, name: 'Example Product', price: 9.99 };
    }

    @MethodTracer()
    createProduct(product: Product): Product {
        return { id: 1, name: 'Example Product', price: 9.99 };
    }
}
