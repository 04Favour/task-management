import { DataSource } from "typeorm";
import { config } from 'dotenv';

config({path:`.env.stage.${process.env.STAGE}`})

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    ssl: process.env.STAGE === 'prod'?{rejectUnauthorized: false}: false,
    migrations: [__dirname + '/migrations/*{.ts,.js}']
})