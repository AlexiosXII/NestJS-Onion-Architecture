import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from 'src/core/application/auth/service/auth.service';
import { LoginUsernameDto } from 'src/core/application/auth/dto/login-username.dto';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('AuthController', () => {
    let app: INestApplication;
    let authService = { loginUsername: jest.fn() };

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: authService,
                },
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/POST authentications`, () => {
        const loginDto: LoginUsernameDto = {
            username: 'testuser',
            password: 'testpass',
        };
        authService.loginUsername.mockResolvedValue('token');

        return request(app.getHttpServer()).post('/authentications').send(loginDto).expect(201).expect('token');
    });

    afterAll(async () => {
        await app.close();
    });
});
