import { Controller, Post, Body } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { LoginUsernameDto } from 'src/core/application/auth/dto/login-username.dto';
import { LoginResponseDto } from 'src/core/application/auth/dto/login-response.dto';
import { AuthService } from 'src/core/application/auth/service/auth.service';
import {
    ErrorResponseDto,
    UnauthorizedResponseDto,
    InternalServerErrorResponseDto,
} from 'src/common/dto/error-response.dto';

@ApiTags('Authentication')
@Controller('authentications')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    @ApiOperation({
        summary: 'Login with username and password',
        description: 'Authenticate user with username and password credentials',
    })
    @ApiBody({
        type: LoginUsernameDto,
        description: 'Login credentials',
    })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: LoginResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data',
        type: ErrorResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid credentials',
        type: UnauthorizedResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: InternalServerErrorResponseDto,
    })
    async login(@Body() createUserDto: LoginUsernameDto): Promise<string> {
        return this.authService.loginUsername(createUserDto);
    }
}
