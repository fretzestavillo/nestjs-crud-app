import { TaskRepository } from './tasks.repository';
import { Body, Param, Query } from '@nestjs/common';
import { createTaskDto } from './dto/create-task-dto';
import { Task } from './entities/task.entity';
import { Injectable } from '@nestjs/common';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { Logger } from '@nestjs/common'; // add sample logger

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService'); // add sample logger
  constructor(private readonly taskRepository: TaskRepository) {}

  // Create task
  createTask(createTaskDto: createTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  // Update status by using parameter id (task id not user id)
  updateTaskStatus(
    id: string,
    createTaskDto: createTaskDto,
    user: User,
  ): Promise<Task> {
    return this.taskRepository.updateTaskStatus(id, createTaskDto, user);
  }

  ////////////////////////////////////
  // Delete task by using  parameter id (task id not user id)
  deleteById(id: string, user: User): Promise<void> {
    return this.taskRepository.deleteById(id, user);
  }

  // Get Task by filter or get all task
  getTasksByFilter(filterDto: GetTasksFilterDTO, user: User): Promise<Task[]> {
    this.logger.verbose('end point called'); // add sample logger

    return this.taskRepository.getTasksByFilter(filterDto, user);
  }

  // Get task by using  parameter id (task id not user id)
  getTaskById(id: string, user: User): Promise<Task> {
    return this.taskRepository.getTaskById(id, user);
  }
}
