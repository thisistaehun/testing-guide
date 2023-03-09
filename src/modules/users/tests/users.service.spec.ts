import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { User } from '../entities/user.entity';
import { DeleteUserTransaction } from '../transactions/delete-user.transaction';
import { UpdateUserTransaction } from '../transactions/update-user.transaction';
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

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let updateUserTransaction: UpdateUserTransaction;
  let deleteUserTransaction: DeleteUserTransaction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: MockRepository },
        { provide: UpdateUserTransaction, useClass: MockUpdateUserTransaction },
        { provide: DeleteUserTransaction, useClass: MockDeleteUserTransaction },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    updateUserTransaction = module.get<UpdateUserTransaction>(
      UpdateUserTransaction
    );
    deleteUserTransaction = module.get<DeleteUserTransaction>(
      DeleteUserTransaction
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserInput: CreateUserInput = {
        name: 'test',
        age: 20,
      };
      const result = await service.create(createUserInput);
      expect(result.name).toEqual(createUserInput.name);
      expect(result.age).toEqual(createUserInput.age);
    });

    afterAll(() => {
      mockUsers.pop();
      expect(mockUsers.length).toEqual(0);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = mockUsers;
      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    let code: string;
    beforeEach(async () => {
      const newUser: User = await service.create({
        name: 'test',
        age: 20,
      });
      code = newUser.code;
    });

    it('should return a user', async () => {
      const result: User = await service.findOne(code);

      expect(result.code).toEqual(code);
    });

    afterAll(() => {
      mockUsers.pop();
      expect(mockUsers.length).toEqual(0);
    });
  });

  describe('update', () => {
    let code: string;
    beforeEach(async () => {
      const newUser: User = await service.create({
        name: 'test',
        age: 20,
      });
      code = newUser.code;
    });

    it('should update a user', async () => {
      const updateUserInput: UpdateUserInput = {
        code,
        name: 'test2',
        age: 30,
      };
      const result = await service.update(updateUserInput);
      expect(result.name).toEqual(updateUserInput.name);
      expect(result.age).toEqual(updateUserInput.age);
    });

    afterAll(() => {
      mockUsers.pop();
      expect(mockUsers.length).toEqual(0);
    });
  });

  describe('remove', () => {
    let code: string;
    beforeEach(async () => {
      const newUser: User = await service.create({
        name: 'test',
        age: 20,
      });
      code = newUser.code;
    });

    it('should remove a user', async () => {
      await service.remove(code);
      expect(mockUsers.length).toEqual(0);
    });
  });
});
