import { Controller, Post, Body } from '@nestjs/common';
import { LoginUsernameDto } from 'src/core/application/auth/dto/login-username.dto';
import { AuthService } from 'src/core/application/auth/service/auth.service';

@Controller('authentications')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async login(@Body() createUserDto: LoginUsernameDto): Promise<string> {
        return this.authService.loginUsername(createUserDto);
    }
}
