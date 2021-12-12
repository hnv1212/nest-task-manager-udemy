import { Injectable, NotFoundException } from '@nestjs/common';
// import { Task, TaskStatus } from './task.model';
import { TaskStatus } from './task-status.enum';
// import { v4 as uuid} from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './task.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  // private tasks: Task[] = []

  // getAllTasks(): Task[] {
  //     return this.tasks
  // }

  // getTaskById(id: string): Task {
  //     const foundTask = this.tasks.find(task => task.id === id)

  //     if(!foundTask) {
  //         throw new NotFoundException(`Task with id: ${id} not found!`)
  //     }

  //     return foundTask
  // }

  // getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
  //     const { status, filter } = filterDto
  //     let tasks = this.getAllTasks()

  //     if(status) {
  //         tasks = tasks.filter(task => task.status === status)
  //     }
  //     if(filter) {
  //         tasks = tasks.filter(task => {
  //             if(task.title.includes(filter) || task.description.includes(filter)) {
  //                 return true
  //             } else {
  //                 return false
  //             }
  //         })
  //     }

  //     return tasks
  // }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //     const {title, description} = createTaskDto

  //     const task: Task = {
  //         id: uuid(),
  //         title,
  //         description,
  //         status: TaskStatus.OPEN
  //     }
  //     this.tasks.push(task)
  //     return task
  // }

  // deleteTask(id: string): void {
  //     const foundTask = this.getTaskById(id)
  //     this.tasks = this.tasks.filter(task => task.id !== foundTask.id)
  // }

  // updateTaskStatus(id: string, status: TaskStatus) {
  //     const task = this.getTaskById(id)
  //     task.status = status
  //     return task
  // }

  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    const foundTask = await this.tasksRepository.findOne({
      where: { id, user },
    });
    if (!foundTask) {
      throw new NotFoundException();
    }

    return foundTask;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({id, user});
    // console.log(result)
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id "${id}" not found.`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }
}
