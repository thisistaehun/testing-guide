import { CreateUserInput } from '../../dto/create-user.input';
import { User } from '../../entities/user.entity';
import { mockUsers } from './mock-users';

export class MockRepository {
  async create(createUserInput: CreateUserInput): Promise<User> {
    const user: User = new User({
      name: createUserInput.name,
      age: createUserInput.age,
    });
    return user;
  }

  async save(user: User): Promise<User> {
    const newUser: User = await Promise.resolve(user);
    mockUsers.push(newUser);
    return newUser;
  }

  async find(): Promise<User[]> {
    return mockUsers;
  }

  async findOne({ where: { code } }): Promise<User> {
    for (const user of mockUsers) {
      if (user.code === code) {
        return user;
      }
    }
  }
}
