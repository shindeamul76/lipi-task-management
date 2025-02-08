import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as E from 'fp-ts/Either';
import { RESTError } from '../types/RESTError';
import { Task } from '@prisma/client';
import {
  TASK_NOT_FOUND,
  TASK_CREATION_FAILED,
  TASK_UPDATE_FAILED,
  TASK_DELETION_FAILED,
  TASK_COMPLETION_FAILED,
  TASK_FETCH_FAILED,
  TASK_STATUS_CALCULATION_FAILED,
  TASK_ALREADY_COMPLETED,
  ERROR_WHILE_DATABASE_OPERATION,
} from '../errors';
import { TaskStatus } from 'src/types/TaskStatusEnum';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) { }

  /**
   * Create a new task
   */
  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description, due_date } = createTaskDto;

    try {
      const task = await this.prisma.task.create({
        data: {
          title,
          description,
          due_date: due_date ? new Date(due_date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      return E.right(task);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return E.left(<RESTError>{
          message: ERROR_WHILE_DATABASE_OPERATION,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      return E.left(<RESTError>{
        message: TASK_CREATION_FAILED,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Retrieve all tasks with computed status
   */
  async getAllTasks() {
    try {
      const tasks = await this.prisma.task.findMany();
      return E.right(
        tasks.map((task) => ({
          ...task,
          status: this.calculateStatus(task),
        })),
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return E.left(<RESTError>{
          message: ERROR_WHILE_DATABASE_OPERATION,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return E.left(<RESTError>{
        message: TASK_FETCH_FAILED,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Update task details
   */
  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.prisma.task.findUnique({ where: { id } });
      if (!task)
        return E.left(<RESTError>{
          message: TASK_NOT_FOUND,
          statusCode: HttpStatus.NOT_FOUND,
        });

      const updatedTask = await this.prisma.task.update({
        where: { id },
        data: { ...updateTaskDto },
      });

      return E.right(updatedTask);
    } catch (error) {
      console.log(error, "error")
      if (error instanceof PrismaClientKnownRequestError) {
        return E.left(<RESTError>{
          message: ERROR_WHILE_DATABASE_OPERATION,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return E.left(<RESTError>{
        message: TASK_UPDATE_FAILED,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Mark a task as completed
   */
  async markTaskComplete(id: number) {
    try {
      if (isNaN(id)) {
        return E.left(<RESTError>{
          message: "Invalid task ID",
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const task = await this.prisma.task.findUnique({ where: { id } });

      if (!task)
        return E.left(<RESTError>{
          message: TASK_NOT_FOUND,
          statusCode: HttpStatus.NOT_FOUND,
        });

      if (task.status === TaskStatus.COMPLETED)
        return E.left(<RESTError>{
          message: TASK_ALREADY_COMPLETED,
          statusCode: HttpStatus.BAD_REQUEST,
        });

      const completedTask = await this.prisma.task.update({
        where: { id },
        data: {
          status: TaskStatus.COMPLETED,
          completed_at: new Date(),
        },
      });

      return E.right(completedTask);
    } catch (error) {

      console.error("Error in markTaskComplete:", error);
      if (error instanceof PrismaClientKnownRequestError) {
        return E.left(<RESTError>{
          message: ERROR_WHILE_DATABASE_OPERATION,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return E.left(<RESTError>{
        message: TASK_COMPLETION_FAILED,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(id: number) {
    try {
      if (isNaN(id)) {
        return E.left(<RESTError>{
          message: "Invalid task ID",
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      const task = await this.prisma.task.findUnique({ where: { id } });
      if (!task)
        return E.left(<RESTError>{
          message: TASK_NOT_FOUND,
          statusCode: HttpStatus.NOT_FOUND,
        });

      await this.prisma.task.delete({ where: { id } });
      return E.right(task);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return E.left(<RESTError>{
          message: ERROR_WHILE_DATABASE_OPERATION,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return E.left(<RESTError>{
        message: TASK_DELETION_FAILED,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Compute task status
   */
  private calculateStatus(task: Task): string {
    try {
      if (task.status === TaskStatus.COMPLETED) return TaskStatus.COMPLETED;
      const today = new Date().toISOString().split('T')[0];
      if (task.due_date.toISOString().split('T')[0] === today) return TaskStatus.DUE_TODAY;
      if (new Date(task.due_date) < new Date()) return TaskStatus.OVERDUE;
      return TaskStatus.PENDING;
    } catch (error) {
      throw new Error(TASK_STATUS_CALCULATION_FAILED);
    }
  }


  async searchTasks(keyword: string) {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        },
      });

      return E.right(tasks);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return E.left(<RESTError>{
          message: ERROR_WHILE_DATABASE_OPERATION,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return E.left(<RESTError>{
        message: TASK_FETCH_FAILED,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}