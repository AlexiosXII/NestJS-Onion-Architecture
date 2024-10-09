import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthRepository } from 'src/core/domain/auth/repositories/auth.repository.interface';
import { UserRepository } from 'src/core/domain/user/repositories/user.repository.interface';
import { LoginUsernameDto } from '../../dto/login-username.dto';

describe('AuthService', () => {
    let authService: AuthService;
    let authRepository: jest.Mocked<AuthRepository>;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(async () => {
        const mockAuthRepository = {
            loginUsername: jest.fn(),
            signToken: jest.fn(),
        };

        const mockUserRepository = {
            findById: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: 'AuthRepository', useValue: mockAuthRepository },
                { provide: 'UserRepository', useValue: mockUserRepository },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        authRepository = module.get('AuthRepository');
        userRepository = module.get('UserRepository');
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('loginUsername', () => {
        it('should return a signed token when login is successful', async () => {
            const loginDto: LoginUsernameDto = {
                username: 'testuser', // cspell:disable-line
                password: 'password123',
            };
            const mockUser = {
                id: 1,
                username: 'testuser', // cspell:disable-line
                name: 'Test User',
                email: 'testuser@example.com',
            };
            const mockToken = 'mock.signed.token';

            userRepository.findById.mockResolvedValue(mockUser);
            authRepository.loginUsername.mockResolvedValue(true);
            authRepository.signToken.mockResolvedValue(mockToken);

            const result = await authService.loginUsername(loginDto);

            expect(userRepository.findById).toHaveBeenCalledWith(1);
            expect(authRepository.loginUsername).toHaveBeenCalledWith({
                username: loginDto.username,
                password: loginDto.password,
            });
            expect(authRepository.signToken).toHaveBeenCalledWith(
                loginDto.username,
            );
            expect(result).toBe(mockToken);
        });

        it('should throw an error when login fails', async () => {
            const loginDto: LoginUsernameDto = {
                username: 'testuser', // cspell:disable-line
                password: 'wrongpassword', // cspell:disable-line
            };
            const mockUser = {
                id: 1,
                username: 'testuser', // cspell:disable-line
                name: 'Test User',
                email: 'testuser@example.com',
            };

            userRepository.findById.mockResolvedValue(mockUser);
            authRepository.loginUsername.mockResolvedValue(false);

            await expect(authService.loginUsername(loginDto)).rejects.toThrow(
                'Invalid credentials',
            );
        });

        it('should throw an error when user is not found', async () => {
            const loginDto: LoginUsernameDto = {
                username: 'nonexistentuser', // cspell:disable-line
                password: 'password123',
            };

            userRepository.findById.mockResolvedValue(null);

            await expect(authService.loginUsername(loginDto)).rejects.toThrow(
                'User not found',
            );

            expect(userRepository.findById).toHaveBeenCalledWith(1);
            expect(authRepository.loginUsername).not.toHaveBeenCalled();
            expect(authRepository.signToken).not.toHaveBeenCalled();
        });
    });

    describe('signToken', () => {
        it('should call authRepository.signToken with the provided username', async () => {
            const username = 'testuser'; // cspell:disable-line
            const mockToken = 'mock.signed.token';

            authRepository.signToken.mockResolvedValue(mockToken);

            const result = await authService.signToken(username);

            expect(authRepository.signToken).toHaveBeenCalledWith(username);
            expect(result).toBe(mockToken);
        });
    });
});
