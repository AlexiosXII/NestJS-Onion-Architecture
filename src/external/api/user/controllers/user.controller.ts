import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse,
    ApiCreatedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/core/application/user/dto/create-user.dto';
import { UserService } from 'src/core/application/user/service/user.service';
import { User } from 'src/core/domain/user/entities/user.entity';
import {
    ErrorResponseDto,
    NotFoundResponseDto,
    InternalServerErrorResponseDto,
} from 'src/common/dto/error-response.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiOperation({
        summary: 'Create a new user',
        description: 'Creates a new user with the provided information',
    })
    @ApiBody({
        type: CreateUserDto,
        description: 'User creation data',
    })
    @ApiCreatedResponse({
        description: 'User created successfully',
        type: User,
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data',
        type: ErrorResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: InternalServerErrorResponseDto,
    })
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.createUser(createUserDto);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get user by ID',
        description: 'Retrieves a user by their unique identifier',
    })
    @ApiParam({
        name: 'id',
        type: 'number',
        description: 'Unique identifier of the user',
        example: 1,
    })
    @ApiResponse({
        status: 200,
        description: 'User retrieved successfully',
        type: User,
    })
    @ApiBadRequestResponse({
        description: 'Invalid user ID format',
        type: ErrorResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'User not found',
        type: NotFoundResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: InternalServerErrorResponseDto,
    })
    async getUserById(@Param('id') id: number): Promise<User> {
        return this.userService.getUserById(id);
    }
}
