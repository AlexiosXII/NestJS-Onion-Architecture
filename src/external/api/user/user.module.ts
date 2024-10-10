import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from 'src/core/application/user/service/user.service';
import { UserRepositoryImpl } from 'src/external/infrastructure/database/repositories/user/user.repository';
import { providerName as userProviderName } from 'src/core/domain/user/repositories/user.repository.interface';
@Module({
    controllers: [UserController],
    providers: [UserService, { provide: userProviderName, useClass: UserRepositoryImpl }],
})
export class UserModule {}
