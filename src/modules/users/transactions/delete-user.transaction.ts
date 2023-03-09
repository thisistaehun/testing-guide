import { Injectable } from '@nestjs/common';
import { BaseTransaction } from '@src/common/transactions/base-transactions';
import { DataSource, EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class DeleteUserTransaction extends BaseTransaction<
  { code: string },
  User
> {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  protected async execute(
    data: { code: string },
    manager: EntityManager
  ): Promise<User> {
    const user: User = await manager.findOne(User, {
      where: {
        code: data.code,
      },
    });
    await manager.delete(User, data.code);
    return user;
  }
}
