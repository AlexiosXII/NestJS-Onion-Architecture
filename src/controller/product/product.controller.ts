import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';
import { Product } from 'src/module/product/product.interface';
import { ProductService } from 'src/module/product/product.service';
import { ProductDto } from './dto/getProductDto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('product')
@Controller('/product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get('/:id')
    getProduct(@Param('id', ParseIntPipe) id: number): Product {
        const res = this.productService.getProduct(id);
        return res;
    }

    @Post('/')
    createProduct(@Body() productDto: ProductDto): Product {
        const res = this.productService.createProduct({
            name: productDto.name,
            price: productDto.price,
        });
        return res;
    }
}
