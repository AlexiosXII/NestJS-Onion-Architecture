import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from 'src/core/application/auth/service/auth.service';
import { AuthRepositoryImpl } from 'src/external/infrastructure/database/repositories/auth/auth.repository';
import { UserRepositoryImpl } from 'src/external/infrastructure/database/repositories/user/user.repository';
import { providerName as authProviderName } from 'src/core/domain/auth/repositories/auth.repository.interface';
import { providerName as userProviderName } from 'src/core/domain/user/repositories/user.repository.interface';
@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        { provide: authProviderName, useClass: AuthRepositoryImpl },
        { provide: userProviderName, useClass: UserRepositoryImpl },
    ],
})
export class AuthModule {}
