import { UpdateUserInput } from '@src/modules/users/dto/update-user.input';
import { User } from '@src/modules/users/entities/user.entity';
import { mockUsers } from '../mock-users';

export class MockUpdateUserTransaction {
  async run({ updateUserInput }: { updateUserInput: UpdateUserInput }) {
    const user: User = mockUsers.find(
      (user) => user.code === updateUserInput.code
    );
    user.name = updateUserInput.name;
    user.age = updateUserInput.age;

    return user;
  }
}
