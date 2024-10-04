import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CreateUserDto } from 'src/core/application/user/dto/create-user.dto';
import { UserService } from 'src/core/application/user/service/user.service';
import { User } from 'src/core/domain/user/entities/user.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.createUser(createUserDto);
    }

    @Get(':id')
    async getUserById(@Param('id') id: number): Promise<User> {
        return this.userService.getUserById(id);
    }
}
