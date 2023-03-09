import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { User } from '../entities/user.entity';
import { DeleteUserTransaction } from '../transactions/delete-user.transaction';
import { UpdateUserTransaction } from '../transactions/update-user.transaction';
import { UsersResolver } from '../users.resolver';
import { UsersService } from '../users.service';

const mockUsers: User[] = [];

class MockRepository {
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

class MockUpdateUserTransaction {
  async run({ updateUserInput }: { updateUserInput: UpdateUserInput }) {
    const user: User = mockUsers.find(
      (user) => user.code === updateUserInput.code
    );
    user.name = updateUserInput.name;
    user.age = updateUserInput.age;

    return user;
  }
}

class MockDeleteUserTransaction {
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
describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;
  let repository: MockRepository;
  let updateUserTransaction: UpdateUserTransaction;
  let deleteUserTransaction: DeleteUserTransaction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: MockRepository,
        },
        { provide: UpdateUserTransaction, useClass: MockUpdateUserTransaction },
        { provide: DeleteUserTransaction, useClass: MockDeleteUserTransaction },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
    repository = module.get<MockRepository>(getRepositoryToken(User));
    updateUserTransaction = module.get<UpdateUserTransaction>(
      UpdateUserTransaction
    );
    deleteUserTransaction = module.get<DeleteUserTransaction>(
      DeleteUserTransaction
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
