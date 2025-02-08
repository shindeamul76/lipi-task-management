import { Controller, Post, Get, Put, Delete, Param, Body, Res, HttpStatus, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as E from 'fp-ts/Either';
import { throwHTTPErr } from '../utils';
import { Response } from 'express';
import { TASK_MESSAGES, ERROR_MESSAGES, TASK_DESCRIPTIONS } from 'src/errors';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  SUCCESS_RESPONSE,
  CREATED_RESPONSE,
  BAD_REQUEST_RESPONSE,
  NOT_FOUND_RESPONSE,
  INTERNAL_SERVER_ERROR_RESPONSE,
} from '../utils';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Create a new task
   */
  @Post()
  @ApiOperation({ summary: 'Create Task', description: TASK_DESCRIPTIONS.CREATE })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse(CREATED_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  @ApiResponse(INTERNAL_SERVER_ERROR_RESPONSE)
  async createTask(@Body() createTaskDto: CreateTaskDto, @Res() res: Response) {
    const task = await this.tasksService.createTask(createTaskDto);
    if (E.isLeft(task)) return throwHTTPErr(task.left);
    return res.status(HttpStatus.CREATED).json({ success: true, message: TASK_MESSAGES.CREATE_SUCCESS, data: task.right });
  }

  /**
   * Retrieve all tasks
   */
  @Get()
  @ApiOperation({ summary: 'Get All Tasks', description: TASK_DESCRIPTIONS.RETRIEVE })
  @ApiResponse(SUCCESS_RESPONSE)
  @ApiResponse(INTERNAL_SERVER_ERROR_RESPONSE)
  async getAllTasks(@Res() res: Response) {
    const tasks = await this.tasksService.getAllTasks();
    if (E.isLeft(tasks)) return throwHTTPErr(tasks.left);
    return res.status(HttpStatus.OK).json({ success: true, message: TASK_MESSAGES.RETRIEVE_SUCCESS, data: tasks.right });
  }

  /**
   * Update task details
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update Task', description: TASK_DESCRIPTIONS.UPDATE })
  @ApiParam({ name: 'id', required: true, description: 'Task ID to update' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse(SUCCESS_RESPONSE)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Res() res: Response) {
    const numericId = parseInt(id, 10);
    const updatedTask = await this.tasksService.updateTask(numericId, updateTaskDto);
    if (E.isLeft(updatedTask)) return throwHTTPErr(updatedTask.left);
    return res.status(HttpStatus.OK).json({ success: true, message: TASK_MESSAGES.UPDATE_SUCCESS, data: updatedTask.right });
  }

  /**
   * Mark task as completed
   */
  @Put(':id/complete')
  @ApiOperation({ summary: 'Complete Task', description: TASK_DESCRIPTIONS.COMPLETE })
  @ApiParam({ name: 'id', required: true, description: 'Task ID to mark as completed' })
  @ApiResponse(SUCCESS_RESPONSE)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async markTaskComplete(@Param('id') id: string, @Res() res: Response) {
    const numericId = parseInt(id, 10);
    const completedTask = await this.tasksService.markTaskComplete(numericId);
    if (E.isLeft(completedTask)) return throwHTTPErr(completedTask.left);
    return res.status(HttpStatus.OK).json({ success: true, message: TASK_MESSAGES.COMPLETE_SUCCESS, data: completedTask.right });
  }

  /**
   * Delete a task
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Task', description: TASK_DESCRIPTIONS.DELETE })
  @ApiParam({ name: 'id', required: true, description: 'Task ID to delete' })
  @ApiResponse(SUCCESS_RESPONSE)
  @ApiResponse(NOT_FOUND_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async deleteTask(@Param('id') id: string, @Res() res: Response) {
    const numericId = parseInt(id, 10);
    const deletedTask = await this.tasksService.deleteTask(numericId);
    if (E.isLeft(deletedTask)) return throwHTTPErr(deletedTask.left);
    return res.status(HttpStatus.OK).json({ success: true, message: TASK_MESSAGES.DELETE_SUCCESS, data: deletedTask.right });
  }

  /**
   * Search tasks by keyword
   */
  @Get('/search')
  @ApiOperation({ summary: 'Search Tasks', description: TASK_DESCRIPTIONS.SEARCH })
  @ApiQuery({ name: 'keyword', required: true, description: 'Keyword to search tasks' })
  @ApiResponse(SUCCESS_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  @ApiResponse(INTERNAL_SERVER_ERROR_RESPONSE)
  async searchTasks(@Query('keyword') keyword: string, @Res() res: Response) {
    if (!keyword) {
      return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.KEYWORD_REQUIRED });
    }
    const tasks = await this.tasksService.searchTasks(keyword);
    if (E.isLeft(tasks)) return throwHTTPErr(tasks.left);
    return res.status(HttpStatus.OK).json({ success: true, message: TASK_MESSAGES.SEARCH_SUCCESS, data: tasks.right });
  }
}