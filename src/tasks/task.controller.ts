import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { CreateTaskDto } from "./dto/createTask.dto";
import { TaskService } from "./task.service";
import { UpdateTaskDto } from "./dto/updateTask.dto";
import { UsePipes } from "@nestjs/common";
import { AuthTokenGuard } from "src/auth/guard/auth.token.guard";
import { REQUEST_TOKEN_PAYLOAD_NAME } from "src/auth/common/auth.constants";
import { CurrentUser } from "src/decorators/currentUser";

@Controller("tasks")
export class TasksController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthTokenGuard)
  @Post("create")
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    const userId = user.sub;
    return this.taskService.createTask(createTaskDto, userId);
  }

  @UseGuards(AuthTokenGuard)
  @Get("list")
  getTasks(@CurrentUser() user: any) {
    const userId = user.sub;
    return this.taskService.getTasksByUser(userId);
  }

  @UseGuards(AuthTokenGuard)
  @Patch("update/:id")
  @UsePipes(new ValidationPipe({ transform: true }))
  updateTask(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @UseGuards(AuthTokenGuard)
  @Delete("delete/:id")
  deleteTask(@Param("id") id: string) {
    return this.taskService.deleteTask(id);
  }
}
