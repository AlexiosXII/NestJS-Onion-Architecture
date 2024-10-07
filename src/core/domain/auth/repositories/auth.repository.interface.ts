import { AuthUsernamePassword } from '../entities/auth.entity';

/**
 * Interface representing the authentication repository.
 */
export interface AuthRepository {
    /**
     * Logs in a user with the provided username and password.
     * @param auth - The username and password for authentication.
     * @returns A promise that resolves to a boolean indicating the success of the login operation.
     */
    loginUsername(auth: AuthUsernamePassword): Promise<boolean>;

    /**
     * Signs a token for the given username.
     * @param username - The username for which the token is to be signed.
     * @returns A promise that resolves to a string containing the signed token.
     */
    signToken(username: string): Promise<string>;
}
