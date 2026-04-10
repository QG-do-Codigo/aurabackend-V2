import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
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
import { PayloadTokenDto } from "src/auth/dto/payload-token.dto";
import { TOKEN_PAYLOAD_PARAM } from "src/auth/param/token-payload-param";
import { Category } from "@prisma/client";

@UseGuards(AuthTokenGuard)
@ApiTags("Tasks")
@Controller("tasks")
export class TasksController {
  constructor(private readonly taskService: TaskService) { }

  @ApiOperation({ summary: "Criar uma nova tarefa para o usuário autenticado" })
  @ApiResponse({ status: 201, description: "Tarefa criada com sucesso" })
  @Post("create")
  create(@Body() createTaskDto: CreateTaskDto, 
  @TOKEN_PAYLOAD_PARAM() tokenPayLoad: PayloadTokenDto
) {
    
    return this.taskService.createTask(createTaskDto, tokenPayLoad);
  }

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
  ) {
    const userId = user.sub;

    if (category && !Object.values(Category).includes(category as Category)) {
      throw new BadRequestException({
        message: "Categoria inválida",
        details: `A categoria '${category}' não existe. Valores permitidos: ${Object.values(Category).join(", ")}`,
      });
    }

    return this.taskService.getTasksByUser(
      userId,
      category as Category,
    );
  }

  @ApiOperation({ summary: "Listar tarefas pela categoria" })
  @ApiResponse({ status: 200, description: "Tarefa por categoria listada com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 404, description: "Tarefa não encontrada" })
  @Get("category/:category")
  @UsePipes(new ValidationPipe({ transform: true }))
  getTaskByCategory(
    @Param("category") category: Category,
    @TOKEN_PAYLOAD_PARAM() tokenPayLoad: PayloadTokenDto
  ) {
    return this.taskService.getTasksByCategory(category, tokenPayLoad)
  }

  @ApiOperation({ summary: "Atualizar uma tarefa pelo ID" })
  @ApiResponse({ status: 200, description: "Tarefa atualizada com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 404, description: "Tarefa não encontrada" })
  @Patch("update/:id")
  @UsePipes(new ValidationPipe({ transform: true }))
  updateTask(@Param("id") id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @ApiOperation({ summary: "Excluir uma tarefa pelo ID" })
  @ApiResponse({ status: 200, description: "Tarefa excluída com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 404, description: "Tarefa não encontrada" })
  @Delete("delete/:id")
  deleteTask(
    @Param("id") id: string,
    @TOKEN_PAYLOAD_PARAM() tokenPayLoad: PayloadTokenDto
  ) {
    return this.taskService.deleteTask(id, tokenPayLoad);
  }

  @ApiOperation({ summary: "Excluir todas as tarefas do usuário autenticado" })
  @ApiResponse({ status: 200, description: "Tarefas excluídas com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @Delete("deleteAll")
  deleteAllTasks(
    @CurrentUser() user: any) {
    const userId = user.sub;
    return this.taskService.deleteAllTasks(userId);
  }
}
