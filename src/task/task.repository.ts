/* eslint-disable prettier/prettier */
import { DataSource, Repository } from "typeorm";
import { Task } from "./task.entity";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateTaskDto } from "./create-task.dto";
import { TaskStatus } from "./task.enum";
import { GetTasksFilterDto } from "./filter.dto";
import { Users } from "src/auth/users.entity";

@Injectable()
export class TasksRepository extends Repository<Task>{
    constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
    async createTask(createTaskDto: CreateTaskDto, user:Users): Promise<Task>{
        const {title, description} = createTaskDto
        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        })
        await this.save(task)
        return task
    }

       async getTasks(filterDto:GetTasksFilterDto, user: Users): Promise<Task[]>{
        const {status, search} = filterDto
        const query = this.createQueryBuilder('task')
        query.where({user})
        if(status){
            query.andWhere('task.status = :status', {status})
        }
        if(search){
            query.andWhere(('lower(task.title) LIKE lower(:search) OR LOWER(task.description) LIKE LOWER(:search)'), {search: `%${search}%`})
        }
        const task = query.getMany()
        return task
    }
}