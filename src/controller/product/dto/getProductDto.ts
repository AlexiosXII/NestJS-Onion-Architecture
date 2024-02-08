import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
    @ApiProperty({
        example: 'Example Product',
        description: 'the name of product',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        example: 9.99,
        description: 'the price of product',
    })
    @IsNotEmpty()
    @IsNumber()
    price: number;
}
