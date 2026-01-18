/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './task.repository';
import { Task } from './task.entity';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from './task.enum';
import { GetTasksFilterDto } from './filter.dto';
import { Users } from 'src/auth/users.entity';

@Injectable()
export class TaskService {
    constructor(private tasksRepository: TasksRepository){}

    async GetTaskById(id: string, user: Users): Promise<Task>{
        const found = await this.tasksRepository.findOne({where:{id, user}});
        if(!found) throw new NotFoundException(`Task with ID "${id}" not found`);
        return found;
    }

    createTask(createTaskDto: CreateTaskDto, user: Users): Promise<Task>{
        return this.tasksRepository.createTask(createTaskDto, user)
    }

    async deleteTask(id: string, user: Users){
        const result = await this.tasksRepository.delete({id, user})
        if(result.affected === 0) throw new NotFoundException()
    }

    async updateStatus(id: string, status: TaskStatus, user: Users): Promise<Task>{
        const task = await this.GetTaskById(id, user)
        task.status = status
        await this.tasksRepository.save(task)
        return task  
    }
    getTasks(filterDto: GetTasksFilterDto, user: Users){
        return this.tasksRepository.getTasks(filterDto, user)
    }

    getTasksForBot(user: Users){
       return this.tasksRepository.getTaskforBot(user)
    }
}
