import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteUserTransaction } from './transactions/delete-user.transaction';
import { UpdateUserTransaction } from './transactions/update-user.transaction';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersResolver,
    UsersService,
    UpdateUserTransaction,
    DeleteUserTransaction,
  ],
  exports: [UsersService],
})
export class UsersModule {}
