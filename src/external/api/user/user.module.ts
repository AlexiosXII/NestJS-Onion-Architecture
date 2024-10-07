import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from 'src/core/application/user/service/user.service';
import { UserRepositoryImpl } from 'src/external/infrastructure/database/repositories/user/user.repository';

@Module({
    controllers: [UserController],
    providers: [
        UserService,
        { provide: 'UserRepository', useClass: UserRepositoryImpl },
    ],
})
export class UserModule {}
