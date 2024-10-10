import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthRepository } from 'src/core/domain/auth/repositories/auth.repository.interface';
import { UserRepository } from 'src/core/domain/user/repositories/user.repository.interface';
import { LoginUsernameDto } from '../../dto/login-username.dto';
import { User } from 'src/core/domain/user/entities/user.entity';
import { AuthError } from 'src/core/domain/auth/errors/auth.error';

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

    describe('loginUsername', () => {
        const loginDto: LoginUsernameDto = { username: 'testuser', password: 'password123' }; // cSpell:disable-line
        const mockUser = new User(1, 'Test User', 'test@example.com');

        it('should successfully login and return a signed token', async () => {
            userRepository.findById.mockResolvedValue(mockUser);
            authRepository.loginUsername.mockResolvedValue(true);
            authRepository.signToken.mockResolvedValue('signed_token');

            const result = await authService.loginUsername(loginDto);

            expect(result).toBe('signed_token');
            expect(userRepository.findById).toHaveBeenCalledWith(1);
            expect(authRepository.loginUsername).toHaveBeenCalledWith(loginDto);
            expect(authRepository.signToken).toHaveBeenCalledWith(loginDto.username);
        });

        it('should throw USER_NOT_FOUND error if user is not found', async () => {
            userRepository.findById.mockResolvedValue(null);

            await expect(authService.loginUsername(loginDto)).rejects.toThrow(
                expect.objectContaining({
                    code: AuthError.USER_NOT_FOUND,
                }),
            );
            expect(userRepository.findById).toHaveBeenCalledWith(1);
            expect(authRepository.loginUsername).not.toHaveBeenCalled();
        });

        it('should throw INVALID_CREDENTIALS error if login fails', async () => {
            userRepository.findById.mockResolvedValue(mockUser);
            authRepository.loginUsername.mockResolvedValue(false);

            await expect(authService.loginUsername(loginDto)).rejects.toThrow(
                expect.objectContaining({
                    code: AuthError.INVALID_CREDENTIALS,
                }),
            );
            expect(userRepository.findById).toHaveBeenCalledWith(1);
            expect(authRepository.loginUsername).toHaveBeenCalledWith(loginDto);
            expect(authRepository.signToken).not.toHaveBeenCalled();
        });
    });

    describe('signToken', () => {
        it('should call authRepository.signToken with the provided username', async () => {
            const username = 'testuser'; // cSpell:disable-line
            const mockToken = 'mocked_signed_token';
            authRepository.signToken.mockResolvedValue(mockToken);

            const result = await authService.signToken(username);

            expect(result).toBe(mockToken);
            expect(authRepository.signToken).toHaveBeenCalledWith(username);
        });
    });
});
