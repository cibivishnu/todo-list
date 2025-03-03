import { DataSource } from "typeorm";
import { Todo } from "../modal/todo";
import { User } from "../modal/user";

export const datasource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '') || 3306,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    entities: [Todo, User],
    synchronize: true
})