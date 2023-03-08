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
  create(createUserInput: CreateUserInput) {
    return this.usersRepository.save(
      this.usersRepository.create(createUserInput)
    );
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(code: string) {
    return this.usersRepository.findOne({
      where: {
        code,
      },
    });
  }

  async update(updateUserInput: UpdateUserInput) {
    return this.updateUserTransaction.run({ updateUserInput });
  }

  async remove(code: string) {
    return this.usersRepository.delete(code);
  }
}
