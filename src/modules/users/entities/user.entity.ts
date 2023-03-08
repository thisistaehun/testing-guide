import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from '@src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity({ name: 'users' })
export class User extends CommonEntity {
  @Field(() => String, { description: 'user name' })
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Field(() => Number, { description: 'user age' })
  @Column({ name: 'age', type: 'int' })
  age: number;
}
