import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ShoppingService } from "./shopping.service";
import { CreateShoppingDto } from "./dto/create-shopping.dto";
import { UpdateShoppingDto } from "./dto/update-shopping.dto";
import { CurrentUser } from "src/decorators/CurrentUser";
import { AuthTokenGuard } from "src/auth/guard/auth.token.guard";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";

@UseGuards(AuthTokenGuard)
@Controller("shopping")
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @ApiOperation({ summary: "Criar uma nova tarefa para o usuário autenticado" })
  @ApiResponse({ status: 201, description: "Tarefa criada com sucesso" })
  @Post("create")
  create(
    @Body() createShoppingDto: CreateShoppingDto,
    @CurrentUser() user: any
  ) {
    const userId = user.sub;
    return this.shoppingService.create(createShoppingDto, userId);
  }

  @ApiOperation({ summary: "Listar tarefas do usuário autenticado" })
  @ApiResponse({ status: 200, description: "Tarefas listadas com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiQuery({
    name: "categoryId",
    required: false,
    description: "Filtrar por ID da categoria",
  })
  @ApiQuery({
    name: "category",
    required: false,
    description: "Filtrar por nome da categoria",
  })
  @Get("list")
  findAll(
    @CurrentUser() user: any,
    @Query("categoryId") categoryId?: string,
    @Query("category") category?: string
  ) {
    const userId = user.sub;
    return this.shoppingService.findAll(userId, categoryId, category);
  }

  @ApiOperation({ summary: "Listar categorias de compras" })
  @ApiResponse({ status: 200, description: "Categorias listadas com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @Get("categories")
  findAllCategories() {
    return this.shoppingService.findAllCategories();
  }

  @ApiOperation({ summary: "Atualizar status" })
  @ApiResponse({ status: 200, description: "Tarefa atualizada com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @Patch("update/:id")
  update(
    @Param("id") id: string,
    @Body() updateShoppingDto: UpdateShoppingDto
  ) {
    return this.shoppingService.update(id, updateShoppingDto);
  }

  @ApiOperation({ summary: "Excluir uma tarefa pelo ID" })
  @ApiResponse({ status: 200, description: "Tarefa excluída com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @Delete("delete/:id")
  remove(@Param("id") id: string) {
    return this.shoppingService.remove(id);
  }
}
