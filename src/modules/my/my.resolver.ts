import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMyInput } from './dto/create-my.input';
import { UpdateMyInput } from './dto/update-my.input';
import { My } from './entities/my.entity';
import { MyService } from './my.service';

@Resolver(() => My)
export class MyResolver {
  constructor(private readonly myService: MyService) {}

  @Mutation(() => My)
  createMy(@Args('createMyInput') createMyInput: CreateMyInput) {
    return this.myService.create(createMyInput);
  }

  @Query(() => [My], { name: 'my' })
  findAll() {
    return this.myService.findAll();
  }

  @Query(() => My, { name: 'my' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.myService.findOne(id);
  }

  @Mutation(() => My)
  updateMy(@Args('updateMyInput') updateMyInput: UpdateMyInput) {
    return this.myService.update(updateMyInput.id, updateMyInput);
  }

  @Mutation(() => My)
  removeMy(@Args('id', { type: () => Int }) id: number) {
    return this.myService.remove(id);
  }
}
