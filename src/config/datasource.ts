import { DataSource } from "typeorm";
import { Todo } from "../modal/todo";
import { User } from "../modal/user";

export const datasource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'todo',
    username: 'root',
    password: '1212',
    entities: [Todo, User],
    synchronize: true
})