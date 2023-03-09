import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { User } from '../entities/user.entity';
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

  async update(updateUserInput: UpdateUserInput) {
    const user: User = await this.findOne({
      where: { code: updateUserInput.code },
    });
    user.name = updateUserInput.name;
    user.age = updateUserInput.age;
    return user;
  }

  async delete(code: string): Promise<void> {
    mockUsers.filter((user) => user.code !== code);
  }
}

class MockUpdateUserTransaction {
  constructor(private readonly repository: MockRepository) {}

  async run({ updateUserInput }: { updateUserInput: UpdateUserInput }) {
    await this.repository.update(updateUserInput);
    return this.repository.findOne({ where: { code: updateUserInput.code } });
  }
}

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let updateUserTransaction: UpdateUserTransaction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: MockRepository },
        { provide: UpdateUserTransaction, useClass: MockUpdateUserTransaction },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    updateUserTransaction = module.get<UpdateUserTransaction>(
      UpdateUserTransaction
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
});
