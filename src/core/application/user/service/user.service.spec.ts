import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from 'src/core/domain/user/repositories/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from 'src/core/domain/user/entities/user.entity';

describe('UserService', () => {
    let userService: UserService;
    let userRepository: UserRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: 'UserRepository',
                    useValue: {
                        create: jest.fn(),
                        findById: jest.fn(),
                    },
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<UserRepository>('UserRepository');
    });

    describe('createUser', () => {
        it('should create a user successfully', async () => {
            const createUserDto: CreateUserDto = {
                name: 'John Doe',
                email: 'john.doe@example.com',
            };
            const user = new User(Date.now(), createUserDto.name, createUserDto.email);

            jest.spyOn(userRepository, 'create').mockResolvedValue(user);

            expect(await userService.createUser(createUserDto)).toEqual(user);
            expect(userRepository.create).toHaveBeenCalledWith(expect.any(User));
        });
    });

    describe('getUserById', () => {
        it('should retrieve a user by ID successfully', async () => {
            const user = new User(1, 'John Doe', 'john.doe@example.com');

            jest.spyOn(userRepository, 'findById').mockResolvedValue(user);

            expect(await userService.getUserById(1)).toEqual(user);
            expect(userRepository.findById).toHaveBeenCalledWith(1);
        });
    });
});
