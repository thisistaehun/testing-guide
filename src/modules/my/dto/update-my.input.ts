import { InputType, PartialType } from '@nestjs/graphql';
import { CreateMyInput } from './create-my.input';

@InputType()
export class UpdateMyInput extends PartialType(CreateMyInput) {}
