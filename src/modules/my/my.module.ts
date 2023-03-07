import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { My } from './entities/my.entity';
import { MyResolver } from './my.resolver';
import { MyService } from './my.service';

@Module({
  imports: [TypeOrmModule.forFeature([My])],
  providers: [MyResolver, MyService],
  exports: [MyService],
})
export class MyModule {}
