import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from 'src/core/application/user/service/user.service';
import { CreateUserDto } from 'src/core/application/user/dto/create-user.dto';
import { User } from 'src/core/domain/user/entities/user.entity';

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        createUser: jest.fn(),
                        getUserById: jest.fn(),
                    },
                },
            ],
        }).compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const createUserDto: CreateUserDto = {
                name: 'John Doe',
                email: 'john@example.com',
            };
            const result: User = { id: 1, ...createUserDto };

            jest.spyOn(userService, 'createUser').mockResolvedValue(result);

            expect(await userController.createUser(createUserDto)).toBe(result);
            expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
        });
    });

    describe('getUserById', () => {
        it('should return a user by id', async () => {
            const result: User = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
            };

            jest.spyOn(userService, 'getUserById').mockResolvedValue(result);

            expect(await userController.getUserById(1)).toBe(result);
            expect(userService.getUserById).toHaveBeenCalledWith(1);
        });
    });
});
