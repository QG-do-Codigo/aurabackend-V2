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
  ValidationPipe,
} from "@nestjs/common";
import { CreateTaskDto } from "./dto/createTask.dto";
import { TaskService } from "./task.service";
import { UpdateTaskDto } from "./dto/updateTask.dto";
import { UsePipes } from "@nestjs/common";
import { AuthTokenGuard } from "src/auth/guard/auth.token.guard";
import { CurrentUser } from "src/decorators/CurrentUser";
import { ApiTags } from "@nestjs/swagger";
import { ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";

@ApiTags("Tasks")
@Controller("tasks")
export class TasksController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthTokenGuard)
  @ApiOperation({ summary: "Criar uma nova tarefa para o usuário autenticado" })
  @ApiResponse({ status: 201, description: "Tarefa criada com sucesso" })
  @Post("create")
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    const userId = user.sub;
    return this.taskService.createTask(createTaskDto, userId);
  }

  @UseGuards(AuthTokenGuard)
  @ApiOperation({
    summary: "Listar tarefas do usuário autenticado com filtros e ordenação",
  })
  @ApiQuery({
    name: "category",
    required: false,
    description: "Filtrar por categoria da tarefa",
  })
  @ApiQuery({
    name: "priority",
    required: false,
    description: "Ordenar por prioridade",
    enum: ["asc", "desc"],
  })
  @Get("list")
  getTasks(
    @CurrentUser() user: any,
    @Query("category") category?: string,
    @Query("priority") priority?: "asc" | "desc"
  ) {
    const userId = user.sub;
    return this.taskService.getTasksByUser(userId, category, priority);
  }

  @UseGuards(AuthTokenGuard)
  @ApiOperation({ summary: "Atualizar uma tarefa pelo ID" })
  @ApiResponse({ status: 200, description: "Tarefa atualizada com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 404, description: "Tarefa não encontrada" })
  @Patch("update/:id")
  @UsePipes(new ValidationPipe({ transform: true }))
  updateTask(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @UseGuards(AuthTokenGuard)
  @ApiOperation({ summary: "Excluir uma tarefa pelo ID" })
  @ApiResponse({ status: 200, description: "Tarefa excluída com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 404, description: "Tarefa não encontrada" })
  @Delete("delete/:id")
  deleteTask(@Param("id") id: string) {
    return this.taskService.deleteTask(id);
  }
}
