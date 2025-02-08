import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Updated Task Title', description: 'Updated title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Updated task description', description: 'Updated description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-02-15', description: 'Updated due date', required: false })
  @IsDateString()
  @IsOptional()
  due_date?: string;
}