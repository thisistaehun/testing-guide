import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { uuid } from './utils/uuid-transformer';

@ObjectType()
export class CommonEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Field(() => String, { description: 'uuid code' })
  @Column({ name: 'code', type: 'varchar', length: 36 })
  @Index({ unique: true })
  code: string = uuid();

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  deletedAt?: Date;

  @BeforeInsert()
  setCreatedAt() {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }

  @BeforeUpdate()
  setUpdatedAt() {
    if (!this.updatedAt) {
      this.updatedAt = new Date();
    }
  }
}
