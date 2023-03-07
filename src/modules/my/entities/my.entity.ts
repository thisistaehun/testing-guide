import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from '@src/common/common.entity';
import { Column, Entity } from 'typeorm';

@InputType('myInputType', { isAbstract: true })
@ObjectType('myObjectType', { isAbstract: true })
@Entity({
  name: 'my',
})
export class My extends CommonEntity {
  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  age: number;
}
