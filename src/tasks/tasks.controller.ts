import { Controller, Post, Get, Put, Delete, Param, Body, Res, HttpStatus, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as E from 'fp-ts/Either';
import { throwHTTPErr } from '../utils';
import { Response } from 'express';
import { KEYWORD_IS_REQUIRED } from 'src/errors';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  /**
   * Create a new task
   */
  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto, @Res() res: Response) {
    const task = await this.tasksService.createTask(createTaskDto);
    if (E.isLeft(task)) return throwHTTPErr(task.left);
    return res.status(HttpStatus.CREATED).json(task.right);
  }

  /**
   * Retrieve all tasks
   */
  @Get()
  async getAllTasks(@Res() res: Response) {
    const tasks = await this.tasksService.getAllTasks();
    if (E.isLeft(tasks)) return throwHTTPErr(tasks.left);
    return res.status(HttpStatus.OK).json(tasks.right);
  }

  /**
   * Update task details
   */
  @Put(':id')
  async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Res() res: Response) {
    const numericId = parseInt(id, 10);
    const updatedTask = await this.tasksService.updateTask(numericId, updateTaskDto);
    if (E.isLeft(updatedTask)) return throwHTTPErr(updatedTask.left);
    return res.status(HttpStatus.OK).json(updatedTask.right);
  }

  /**
   * Mark task as completed
   */
  @Put(':id/complete')
  async markTaskComplete(@Param('id') id: string, @Res() res: Response) {
    const numericId = parseInt(id, 10);
    const completedTask = await this.tasksService.markTaskComplete(numericId);
    if (E.isLeft(completedTask)) return throwHTTPErr(completedTask.left);
    return res.status(HttpStatus.OK).json(completedTask.right);
  }

  /**
   * Delete a task
   */
  @Delete(':id')
  async deleteTask(@Param('id') id: string, @Res() res: Response) {
    const numericId = parseInt(id, 10);
    const deletedTask = await this.tasksService.deleteTask(numericId);
    if (E.isLeft(deletedTask)) return throwHTTPErr(deletedTask.left);
    return res.status(HttpStatus.OK).json(deletedTask.right);
  }

    /**
   * Search tasks by keyword
   */

  @Get('/search')
  async searchTasks(@Query('keyword') keyword: string, @Res() res: Response) {
    if (!keyword) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: KEYWORD_IS_REQUIRED,
      });
    }
    const tasks = await this.tasksService.searchTasks(keyword);
    if (E.isLeft(tasks)) return throwHTTPErr(tasks.left);

    return res.status(HttpStatus.OK).json(tasks.right);
  }
}