import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { IdeaService } from "./idea.service";
import { CreateIdeaDto } from "./dto/create-idea.dto";
import { UpdateIdeaDto } from "./dto/update-idea.dto";
import { CurrentUser } from "src/decorators/CurrentUser";
import { AuthTokenGuard } from "src/auth/guard/auth.token.guard";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@UseGuards(AuthTokenGuard)
@ApiTags("Ideas")
@Controller("ideas")
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @ApiOperation({ summary: "Criar uma nova ideia para o usuário autenticado" })
  @ApiResponse({ status: 201, description: "Ideia criada com sucesso" })
  @Post()
  create(@Body() createIdeaDto: CreateIdeaDto, @CurrentUser() user: any) {
    const userId = user.sub;
    return this.ideaService.create(createIdeaDto, userId);
  }

  @ApiOperation({ summary: "Listar todas as ideias do usuário autenticado" })
  @ApiResponse({ status: 200, description: "Ideias listadas com sucesso" })
  @Get()
  findAll() {
    return this.ideaService.findAll();
  }

  @ApiOperation({ summary: "Listar todas as categorias de ideias" })
  @ApiResponse({ status: 200, description: "Categorias listadas com sucesso" })
  @Get("categories")
  findAllCategories() {
    return this.ideaService.findAllCategories();
  }

  @ApiOperation({ summary: "Obter detalhes de uma ideia específica" })
  @ApiResponse({ status: 200, description: "Ideia obtida com sucesso" })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ideaService.findOne(id);
  }

  @ApiOperation({ summary: "Atualizar uma ideia existente" })
  @ApiResponse({ status: 200, description: "Ideia atualizada com sucesso" })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateIdeaDto: UpdateIdeaDto) {
    return this.ideaService.update(id, updateIdeaDto);
  }

  @ApiOperation({ summary: "Remover uma ideia" })
  @ApiResponse({ status: 200, description: "Ideia removida com sucesso" })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ideaService.remove(id);
  }
}
