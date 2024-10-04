import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserRepositoryImpl } from 'src/infrastructure/database/repositories/user.repository';
import { UserService } from 'src/core/application/user/service/user.service';

@Module({
    controllers: [UserController],
    providers: [
        UserService,
        { provide: 'UserRepository', useClass: UserRepositoryImpl },
    ],
})
export class UserModule {}
