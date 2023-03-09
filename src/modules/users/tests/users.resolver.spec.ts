import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { DeleteUserTransaction } from '../transactions/delete-user.transaction';
import { UpdateUserTransaction } from '../transactions/update-user.transaction';
import { UsersResolver } from '../users.resolver';
import { UsersService } from '../users.service';
import { MockUserRepository } from './mocks/mock-users.repository';
import { MockDeleteUserTransaction } from './mocks/transactions/mock-delete-user.transaction';
import { MockUpdateUserTransaction } from './mocks/transactions/mock-update-user.transaction';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
        { provide: UpdateUserTransaction, useClass: MockUpdateUserTransaction },
        { provide: DeleteUserTransaction, useClass: MockDeleteUserTransaction },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
