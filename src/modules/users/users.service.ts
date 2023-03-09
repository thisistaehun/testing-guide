import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UpdateUserTransaction } from './transactions/update-user.transaction';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly updateUserTransaction: UpdateUserTransaction
  ) {}
  async create(createUserInput: CreateUserInput): Promise<User> {
    return this.usersRepository.save(
      this.usersRepository.create(createUserInput)
    );
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(code: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        code,
      },
    });
  }

  async update(updateUserInput: UpdateUserInput): Promise<User> {
    return this.updateUserTransaction.run({ updateUserInput });
  }

  async remove(code: string): Promise<User> {
    const user: User = await this.findOne(code);
    const deleted = await this.usersRepository.delete(code);
    if (deleted.affected > 0) {
      return user;
    }
  }
}
