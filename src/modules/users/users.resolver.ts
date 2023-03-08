import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User, { name: 'createUser' })
  createUser(
    @Args('createUserInput', {
      type: () => CreateUserInput,
    })
    createUserInput: CreateUserInput
  ) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('code', { type: () => String }) code: string) {
    return this.usersService.findOne(code);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput', {
      type: () => UpdateUserInput,
    })
    updateUserInput: UpdateUserInput
  ) {
    return this.usersService.update(updateUserInput);
  }

  @Mutation(() => User, { name: 'removeUser' })
  removeUser(@Args('code', { type: () => String }) code: string) {
    return this.usersService.remove(code);
  }
}
