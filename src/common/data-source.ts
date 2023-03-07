import { DataSource } from 'typeorm';
import { ormOptions } from './ormconfig';

export const dataSource: DataSource = new DataSource(ormOptions);
