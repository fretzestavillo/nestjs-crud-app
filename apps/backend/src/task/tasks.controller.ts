import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { createTaskDto } from './dto/create-task-dto';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common'; // add sample logger
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController');
  constructor(private readonly taskService: TasksService) {}

  // Create task
  @Post()
  createTask(
    @Body() createTaskDto: createTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  // Update status by using parameter id (task id not user id)
  @Patch(':id')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() createTaskDto: createTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, createTaskDto, user);
  }

  ////////////////////////////////////
  // Delete task by using parameter id (task id not user id)
  @Delete(':id')
  deleteById(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.taskService.deleteById(id, user);
  }

  // Get Task by filter or get all task
  @Get()
  getTasksByFilter(
    @Query() filterDto: GetTasksFilterDTO,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose('end point called'); // add sample logger
    return this.taskService.getTasksByFilter(filterDto, user);
  }

  //   Get task by using parameter id (task id not user id)
  @Get(':id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }
}
