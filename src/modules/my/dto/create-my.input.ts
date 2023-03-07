import { InputType } from '@nestjs/graphql';
import { My } from '../entities/my.entity';

@InputType()
export class CreateMyInput extends My {}
