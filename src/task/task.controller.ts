/* eslint-disable prettier/prettier */
import { Controller, HttpCode, HttpStatus, Param, Get, Post, Body, Delete, Patch, Query, UseGuards, Logger } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './create-task.dto';
import { UpdateStatusDto } from './update-task.dto';
import { GetTasksFilterDto } from './filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { Users } from 'src/auth/users.entity';
import { GetUser } from './../auth/get-user.decorator';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
  private Logger = new Logger(TaskController.name, {timestamp: true})
  constructor(private readonly taskService: TaskService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  GetTaskById(@Param('id') id: string, @GetUser() user:Users): Promise<Task>{
    return this.taskService.GetTaskById(id, user)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTask(@Body() createTaskDto:CreateTaskDto, @GetUser()user: Users){
    return this.taskService.createTask(createTaskDto, user)
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: Users){
    return this.taskService.deleteTask(id, user)
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() updateStatus: UpdateStatusDto, @GetUser() user: Users){
    const {status} = updateStatus
    return this.taskService.updateStatus(id, status, user)
  }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: Users): Promise<Task[]>{
    this.Logger.log(`Get task for only ${user.username}`)
    return this.taskService.getTasks(filterDto, user)
  }
}
