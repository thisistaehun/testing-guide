import { Injectable } from '@nestjs/common';
import { CreateMyInput } from './dto/create-my.input';
import { UpdateMyInput } from './dto/update-my.input';

@Injectable()
export class MyService {
  create(createMyInput: CreateMyInput) {
    return 'This action adds a new my';
  }

  findAll() {
    return `This action returns all my`;
  }

  findOne(id: number) {
    return `This action returns a #${id} my`;
  }

  update(id: number, updateMyInput: UpdateMyInput) {
    return `This action updates a #${id} my`;
  }

  remove(id: number) {
    return `This action removes a #${id} my`;
  }
}
