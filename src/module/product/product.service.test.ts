import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as winston from 'winston';

describe('ProductService', () => {
    let productService: ProductService;
    let logger: winston.Logger;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: WINSTON_MODULE_PROVIDER,
                    useValue: {
                        info: jest.fn(),
                    },
                },
            ],
        }).compile();

        productService = module.get<ProductService>(ProductService);
        logger = module.get<winston.Logger>(WINSTON_MODULE_PROVIDER);
    });

    describe('getProduct', () => {
        it('should return the product with the given id', () => {
            // Arrange
            const id = 1;
            const expectedProduct = {
                id: 1,
                name: 'Example Product',
                price: 9.99,
            };

            // Act
            const result = productService.getProduct(id);

            // Assert
            expect(result).toEqual(expectedProduct);
            expect(logger.info).toHaveBeenCalledWith(
                `Execute ProductService.getProduct(${id})`,
            );
        });
    });
});
