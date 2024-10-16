import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  Injectable,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common'; // add sample logger

import { createTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { Task } from './entities/task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class TaskRepository {
  private logger = new Logger('TaskRepository'); // add sample logger
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  // Create item
  createTask(createTaskDto: createTaskDto, user: User): Promise<Task> {
    const task: Task = new Task();
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    task.image = createTaskDto.image;
    task.user = user;
    return this.taskRepository.save(task);
  }

  // Update status  by using parameter id (task id not user id)
  async updateTaskStatus(
    id: string,
    createTaskDto: createTaskDto,
    user: User,
  ): Promise<Task> {
    try {
      // Fetch the existing task by ID and the user
      const task = await this.getTaskById(id, user);

      // Destructure the fields from createTaskDto
      const { title, description, image } = createTaskDto;

      // Update the task fields
      task.title = title;
      task.description = description;
      task.image = image;

      // Save the updated task back to the repository
      await this.taskRepository.save(task);

      return task;
    } catch (error) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  /////////////////////////////////////
  // Delete task by using parameter id
  async deleteById(id: string, user: User): Promise<void> {
    try {
      const result = await this.taskRepository.delete({ id, user });

      console.log(result);
    } catch (err) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  // Get Task by filter or get all task
  async getTasksByFilter(
    filterDto: GetTasksFilterDTO,
    user: User,
  ): Promise<Task[]> {
    const { search, sortBy, direction } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (sortBy) {
      query.addOrderBy(sortBy, direction || 'DESC');
    }

    try {
      this.logger.verbose(`User: "${user.username}" get all tasks`); // add sample logger
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user: "${user.username}". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      ); // add sample logger
      throw new InternalServerErrorException();
    }
  }

  // Get one task by using task id
  async getTaskById(id: string, user: User): Promise<Task> {
    try {
      //   const found = await this.taskRepository.findOneBy({ id });
      const found = await this.taskRepository.findOne({
        where: { id },
        // where: { id, user },
      });
      return found;
    } catch (err) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
}
