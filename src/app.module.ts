import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configOptions } from './common/options';
import { ormOptions } from './common/orm.config';
import { GraphQLWithUploadModule } from './graphql.module';
import { MyModule } from './modules/my/my.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    TypeOrmModule.forRoot(ormOptions),
    GraphQLWithUploadModule.forRoot(),
    MyModule,
  ],
  providers: [
    {
      provide: 'NODE_ENV',
      useValue: ENV,
    },
  ],
})
export class AppModule {}
