import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from 'src/core/domain/auth/repositories/auth.repository.interface';
import { UserRepository } from 'src/core/domain/user/repositories/user.repository.interface';
import { LoginUsernameDto } from '../dto/login-username.dto';

describe('AuthService', () => {
    let authService: AuthService;
    let authRepository: AuthRepository;
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: 'AuthRepository',
                    useValue: {
                        loginUsername: jest.fn(),
                        signToken: jest.fn(),
                    },
                },
                {
                    provide: 'UserRepository',
                    useValue: {
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        authRepository = module.get<AuthRepository>('AuthRepository');
        userRepository = module.get<UserRepository>('UserRepository');
    });

    describe('loginUsername', () => {
        it('should return a signed token if login is successful', async () => {
            const loginDto: LoginUsernameDto = {
                username: 'testuser',
                password: 'testpass',
            };
            const signedToken = 'signed-token';

            jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({
                id: 1,
                name: 'Test User',
                email: 'testuser@example.com',
            });
            jest.spyOn(authRepository, 'loginUsername').mockResolvedValueOnce(
                true,
            );
            jest.spyOn(authRepository, 'signToken').mockResolvedValueOnce(
                signedToken,
            );

            const result = await authService.loginUsername(loginDto);

            expect(result).toBe(signedToken);
            expect(userRepository.findById).toHaveBeenCalledWith(1);
            expect(authRepository.loginUsername).toHaveBeenCalledWith({
                username: loginDto.username,
                password: loginDto.password,
            });
            expect(authRepository.signToken).toHaveBeenCalledWith(
                loginDto.username,
            );
        });

        it('should throw an error if login fails', async () => {
            const loginDto: LoginUsernameDto = {
                username: 'testuser',
                password: 'testpass',
            };

            jest.spyOn(userRepository, 'findById').mockResolvedValueOnce({
                id: 1,
                name: 'Test User',
                email: 'testuser@example.com',
            });
            jest.spyOn(authRepository, 'loginUsername').mockResolvedValueOnce(
                false,
            );

            await expect(authService.loginUsername(loginDto)).rejects.toThrow(
                'Invalid credentials',
            );
            expect(userRepository.findById).toHaveBeenCalledWith(1);
            expect(authRepository.loginUsername).toHaveBeenCalledWith({
                username: loginDto.username,
                password: loginDto.password,
            });
        });
    });

    describe('signToken', () => {
        it('should return a signed token', async () => {
            const username = 'testuser';
            const signedToken = 'signed-token';

            jest.spyOn(authRepository, 'signToken').mockResolvedValueOnce(
                signedToken,
            );

            const result = await authService.signToken(username);

            expect(result).toBe(signedToken);
            expect(authRepository.signToken).toHaveBeenCalledWith(username);
        });
    });
});
