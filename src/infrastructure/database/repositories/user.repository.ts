import { Injectable } from '@nestjs/common';
import { User } from 'src/core/domain/user/entities/user.entity';
import { UserRepository } from 'src/core/domain/user/repositories/user.repository.interface';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
    private users: User[] = [];

    async findById(id: number): Promise<User> {
        return this.users.find((user) => user.id === id);
    }

    async create(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }
}
