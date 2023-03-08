import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutput {
  ok: boolean;
  message?: string;
  error?: string;
}
