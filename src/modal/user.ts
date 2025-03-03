import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Todo } from "./todo";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { unique: true})
    name: string;

    @OneToMany(() => Todo, (todo) => todo.user)
    todos: Todo[];
}