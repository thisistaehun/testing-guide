import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserTransaction } from '../transactions/update-user.transaction';
import { UsersResolver } from '../users.resolver';
import { UsersService } from '../users.service';

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

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersResolver,
        { provide: getRepositoryToken(User), useValue: mockRepository },
        { provide: UpdateUserTransaction, useValue: mockUpdateUserTransaction },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
