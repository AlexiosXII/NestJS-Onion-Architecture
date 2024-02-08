import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('ProductController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/product', () => {
        it('GET /product/:id', () => {
            return request(app.getHttpServer())
                .get('/product/1')
                .expect(200)
                .expect({
                    statusCode: 200,
                    message: 'OK',
                    data: { id: 1, name: 'Example Product', price: 9.99 },
                });
        });
    });
});
