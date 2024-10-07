import jwt from 'jsonwebtoken';
import { AuthUsernamePassword } from 'src/core/domain/auth/entities/auth.entity';
import { AuthRepository } from 'src/core/domain/auth/repositories/auth.repository.interface';

export class AuthRepositoryImpl implements AuthRepository {
    private readonly users: Map<string, string>; // A simple in-memory store for users

    constructor() {
        this.users = new Map();
        // Example user for testing
        this.users.set('testUser', 'testPassword');
    }

    async loginUsername(auth: AuthUsernamePassword): Promise<boolean> {
        const { username, password } = auth;
        const storedPassword = this.users.get(username);
        if (storedPassword && storedPassword === password) {
            return true;
        }
        return false;
    }

    async signToken(username: string): Promise<string> {
        const secretKey = 'your-secret-key'; // Replace with your actual secret key
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        return token;
    }
}
