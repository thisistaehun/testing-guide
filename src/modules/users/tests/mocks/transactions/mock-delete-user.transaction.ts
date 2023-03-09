import { User } from '@src/modules/users/entities/user.entity';
import { mockUsers } from '../mock-users';

export class MockDeleteUserTransaction {
  async run({ code }: { code: string }) {
    const user: User = mockUsers.find((user) => user.code === code);
    for (let i = 0; i < mockUsers.length; i++) {
      if (mockUsers[i].code === code) {
        mockUsers.splice(i, 1);
      }
    }
    return user;
  }
}
