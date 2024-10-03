import { Injectable, Logger } from '@nestjs/common';
import { Product } from './product.interface';
import { MethodTracer } from 'src/common/decorator/method-tracer.decorator';

@Injectable()
@MethodTracer()
export class ProductService {
    private readonly logger = new Logger(ProductService.name);

    getProduct(id: number): Product {
        return { id: 1, name: 'Example Product', price: 9.99 };
    }

    createProduct(product: Product): Product {
        return { id: 1, name: 'Example Product', price: 9.99 };
    }
}
