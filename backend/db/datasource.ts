import { DataSource,DataSourceOptions } from "typeorm";
import {config} from 'dotenv';
config();
export const dataSourceOptions:DataSourceOptions={
    type:'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*{.ts,.js}'],
    logging: false,
    synchronize: false
}

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;