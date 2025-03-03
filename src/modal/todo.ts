import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity('todo')
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;
            
    @Column('varchar')
    title: string;

    @Column('text')
    description: string;

    @Column('varchar')
    status: string;

    @Column('datetime')
    createdAt: Date;
    
    @Column('datetime')
    updatedAt: Date;

    @Column('datetime', {nullable: true})
    deadline: Date;

    @ManyToOne(() => User)
    @JoinColumn({name: 'user'})
    user:User;
} 