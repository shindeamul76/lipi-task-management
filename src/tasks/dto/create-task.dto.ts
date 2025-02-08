import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete NestJS API', description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Build a complete API using NestJS and Prisma', description: 'Task description', required: false })
  @IsString()
  @IsOptional()
  description?: string;


  @ApiProperty({ example: '2025-02-10', description: 'Due date for the task', required: false })
  @IsDateString()
  @IsOptional()
  due_date?: string;
}