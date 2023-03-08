import { Injectable } from '@nestjs/common';
import { BaseTransaction } from '@src/common/transactions/base-transactions';
import { DataSource, EntityManager } from 'typeorm';
import { UpdateUserInput } from '../dto/update-user.input';
import { User } from '../entities/user.entity';

@Injectable()
export class UpdateUserTransaction extends BaseTransaction<
  { updateUserInput: UpdateUserInput },
  User
> {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  protected async execute(
    data: { updateUserInput: UpdateUserInput },
    manager: EntityManager
  ): Promise<User> {
    await manager.update(User, data.updateUserInput.code, data.updateUserInput);
    return manager.findOne(User, {
      where: {
        code: data.updateUserInput.code,
      },
    });
  }
}
