import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from "@nestjs/common";
import { CreateTaskDto } from "./dto/createTask.dto";
import { TaskService } from "./task.service";
import { UpdateTaskDto } from "./dto/updateTask.dto";
import { UsePipes } from "@nestjs/common";

@Controller("tasks")
export class TasksController {
  constructor(private readonly taskService: TaskService) {}

  @Post("create")
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @Get("list")
  getTasks() {
    return this.taskService.getTasks();
  }

  @Patch("update/:id")
  @UsePipes(new ValidationPipe({ transform: true }))
  updateTask(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete("delete/:id")
  deleteTask(@Param("id") id: string) {
    return this.taskService.deleteTask(id);
  }
}
