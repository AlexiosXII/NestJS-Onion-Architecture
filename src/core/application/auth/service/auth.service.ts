import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuthRepository } from 'src/core/domain/auth/repositories/auth.repository.interface';
import { LoginUsernameDto } from '../dto/login-username.dto';
import { MethodTracer } from 'src/common/decorators/method-tracer/method-tracer.decorator';
import { UserRepository } from 'src/core/domain/user/repositories/user.repository.interface';
import { ApplicationError } from 'src/common/errors/application.error';
import { AuthError } from 'src/core/domain/auth/errors/auth.error';

/**
 * Service responsible for handling authentication-related operations.
 *
 * @class AuthService
 * @implements {AuthService}
 */

@MethodTracer()
@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    /**
     * Creates an instance of AuthService.
     *
     * @param authRepository - The repository used for authentication operations.
     * @param userRepository - The repository used for user operations.
     */
    constructor(
        @Inject('AuthRepository')
        private readonly authRepository: AuthRepository,
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
    ) {}

    /**
     * Logs in a user with the provided credentials.
     *
     * @param {LoginUsernameDto} auth - The login credentials.
     * @returns {Promise<string>} - A promise that resolves to a signed token if login is successful.
     * @throws {ApplicationError} - Throws an error if the credentials are invalid.
     */
    async loginUsername(auth: LoginUsernameDto): Promise<string> {
        const user = await this.userRepository.findById(1);
        if (!user) {
            throw new ApplicationError(AuthError.USER_NOT_FOUND);
        }

        const loginResult = await this.authRepository.loginUsername(auth);
        if (!loginResult) {
            throw new ApplicationError(AuthError.INVALID_CREDENTIALS);
        }

        return this.signToken(auth.username);
    }

    /**
     * Signs a token for the given username.
     *
     * @param {string} username - The username for which to sign the token.
     * @returns {Promise<string>} - A promise that resolves to the signed token.
     */
    async signToken(username: string): Promise<string> {
        return this.authRepository.signToken(username);
    }
}
