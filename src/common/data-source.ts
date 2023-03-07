import { DataSource } from 'typeorm';
import { ormOptions } from './orm.config';

export const dataSource: DataSource = new DataSource(ormOptions);
