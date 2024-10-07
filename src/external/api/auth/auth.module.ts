import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from 'src/core/application/auth/service/auth.service';
import { AuthRepositoryImpl } from 'src/external/infrastructure/database/repositories/auth/auth.repository';
import { UserRepositoryImpl } from 'src/external/infrastructure/database/repositories/user/user.repository';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        { provide: 'AuthRepository', useClass: AuthRepositoryImpl },
        { provide: 'UserRepository', useClass: UserRepositoryImpl },
    ],
})
export class AuthModule {}
