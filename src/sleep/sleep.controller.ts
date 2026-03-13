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
import { SleepService } from "./sleep.service";
import { CreateSleepDto } from "./dto/create-sleep.dto";
import { UpdateSleepDto } from "./dto/update-sleep.dto";
import { CurrentUser } from "src/decorators/CurrentUser";
import { AuthTokenGuard } from "src/auth/guard/auth.token.guard";
import { ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";

@UseGuards(AuthTokenGuard)
@Controller("sleep")
export class SleepController {
  constructor(private readonly sleepService: SleepService) {}

  @ApiOperation({
    summary: "Criar uma nova meta de sono",
    description: "Criar uma nova meta de sono",
  })
  @ApiResponse({ status: 201, description: "Meta de sono criada com sucesso" })
  @ApiResponse({ status: 400, description: "Erro ao criar meta de sono" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @Post("create")
  create(@Body() createSleepDto: CreateSleepDto, @CurrentUser() user: any) {
    const userId = user.sub;
    return this.sleepService.create(createSleepDto, userId);
  }

  @ApiOperation({
    summary: "Listar metas de sono do usuário",
    description: "Listar metas de sono do usuário",
  })
  @ApiResponse({
    status: 200,
    description: "Metas de sono listadas com sucesso",
  })
  @ApiResponse({ status: 400, description: "Erro ao listar metas de sono" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @Get("list")
  findAll(@CurrentUser() user: any) {
    const userId = user.sub;
    return this.sleepService.findAll(userId);
  }

  @ApiOperation({
    summary: "Atualizar uma meta de sono pelo ID",
    description: "Atualizar uma meta de sono pelo ID",
  })
  @ApiResponse({
    status: 200,
    description: "Meta de sono atualizada com sucesso",
  })
  @ApiResponse({ status: 400, description: "Erro ao atualizar meta de sono" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @Patch("update/:id")
  update(
    @Param("id") id: string,
    @Body() updateSleepDto: UpdateSleepDto,
    @CurrentUser() user: any
  ) {
    const userId = user.sub;
    return this.sleepService.update(id, updateSleepDto, userId);
  }

  @ApiOperation({
    summary: "Deletar uma meta de sono pelo ID",
    description: "Deletar uma meta de sono pelo ID",
  })
  @ApiResponse({
    status: 200,
    description: "Meta de sono deletada com sucesso",
  })
  @ApiResponse({ status: 400, description: "Erro ao deletar meta de sono" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @Delete("delete/:id")
  remove(@Param("id") id: string) {
    return this.sleepService.remove(id);
  }
}
