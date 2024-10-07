import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/core/domain/user/entities/user.entity';
import { UserRepository } from 'src/core/domain/user/repositories/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { MethodTracer } from 'src/common/decorator/method-tracer/method-tracer.decorator';

/**
 * @class UserService
 * @description Service class for managing user-related operations.
 * @decorator `@MethodTracer()`
 * @decorator `@Injectable()`
 */

@MethodTracer()
@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    /**
     * @constructor
     * @param {UserRepository} userRepository - The repository instance for user data access.
     */
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
    ) {}

    /**
     * Creates a new user.
     * @param {CreateUserDto} createUserDto - Data transfer object containing user creation details.
     * @returns {Promise<User>} - The created user.
     */
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { name, email } = createUserDto;
        const user = new User(Date.now(), name, email); // Simulate ID assignment
        return this.userRepository.create(user);
    }

    /**
     * Retrieves a user by their ID.
     * @param {number} id - The ID of the user to retrieve.
     * @returns {Promise<User>} - The user with the specified ID.
     */
    async getUserById(id: number): Promise<User> {
        return this.userRepository.findById(id);
    }
}
