import { User } from '@src/modules/users/entities/user.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSourceOptions } from 'typeorm';

const ENV = process.env.NODE_ENV;
dotenv.config({
  path: path.join(__dirname, `../../config/.${ENV}.env`),
});

export const ormOptions: DataSourceOptions = {
  type: 'mysql',
  url: process.env.DB_URL,
  logging: true,
  logger: 'file',
  synchronize: true,
  charset: 'utf8mb4',
  entities: [User],
};
