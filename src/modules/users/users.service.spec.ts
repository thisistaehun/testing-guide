import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserTransaction } from './transactions/update-user.transaction';
import { UsersService } from './users.service';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

const mockUpdateUserTransaction = {
  run: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let updateUserTransaction: UpdateUserTransaction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
        { provide: UpdateUserTransaction, useValue: mockUpdateUserTransaction },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    updateUserTransaction = module.get<UpdateUserTransaction>(
      UpdateUserTransaction
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
