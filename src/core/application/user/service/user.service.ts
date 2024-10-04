import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from 'src/core/domain/user/entities/user.entity';
import { UserRepository } from 'src/core/domain/user/repositories/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { MethodTracer } from 'src/common/decorator/method-tracer.decorator';

@MethodTracer()
@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { name, email } = createUserDto;
        const user = new User(Date.now(), name, email); // Simulate ID assignment
        return this.userRepository.create(user);
    }

    async getUserById(id: number): Promise<User> {
        return this.userRepository.findById(id);
    }
}
