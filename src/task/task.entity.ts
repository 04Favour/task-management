/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./task.enum";
import { Users } from "src/auth/users.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    @ManyToOne(()=> Users, user=>user.tasks, {eager: false})
    @Exclude()
    user: Users
}