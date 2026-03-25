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
import { HealthService } from "./health.service";
import { CreateHealthDto } from "./dto/create-health.dto";
import { UpdateHealthDto } from "./dto/update-health.dto";
import { ConfirmHealthDto } from "./dto/confirm-health.dto";
import { CurrentUser } from "src/decorators/CurrentUser";
import { AuthTokenGuard } from "src/auth/guard/auth.token.guard";

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";

@ApiTags("Saúde")
@ApiBearerAuth("access-token")
@UseGuards(AuthTokenGuard )
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Post()
  @ApiOperation({ summary: "Criar um novo lembrete de saúde" })
  @ApiResponse({ status: 201, description: "Lembrete criado com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  create(
    @Body() createHealthDto: CreateHealthDto,
    @CurrentUser() user: any,
  ) {
    return this.healthService.create(createHealthDto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os lembretes do usuário" })
  @ApiResponse({ status: 200, description: "Lista de lembretes retornada" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  findAll(@CurrentUser() user: any) {
    return this.healthService.findAll(user.sub);
  }

  @Get("week")
  @ApiOperation({ summary: "Listar lembretes com status da semana" })
  @ApiResponse({ status: 200, description: "Semana retornada com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  getWeek(@CurrentUser() user: any) {
    return this.healthService.getWeek(user.sub);
  }

  @Post("confirm")
  @ApiOperation({ summary: "Confirmar lembrete por data do evento" })
  @ApiResponse({ status: 201, description: "Confirmação registrada" })
  @ApiResponse({ status: 400, description: "Data inválida" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  confirm(@Body() confirmHealthDto: ConfirmHealthDto, @CurrentUser() user: any) {
    return this.healthService.confirm(
      confirmHealthDto.reminderId,
      user.sub,
      confirmHealthDto.date,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar um lembrete específico" })
  @ApiParam({ name: "id", description: "ID do lembrete" })
  @ApiResponse({ status: 200, description: "Lembrete encontrado" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 404, description: "Lembrete não encontrado" })
  findOne(@Param("id") id: string, @CurrentUser() user: any) {
    return this.healthService.findOne(id, user.sub);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar um lembrete de saúde" })
  @ApiParam({ name: "id", description: "ID do lembrete" })
  @ApiResponse({ status: 200, description: "Lembrete atualizado com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  update(
    @Param("id") id: string,
    @Body() updateHealthDto: UpdateHealthDto,
    @CurrentUser() user: any,
  ) {
    return this.healthService.update(id, user.sub, updateHealthDto);
  }

  @Patch(":id/done")
  @ApiOperation({ summary: "Marcar lembrete como concluído no dia atual" })
  @ApiParam({ name: "id", description: "ID do lembrete" })
  @ApiResponse({ status: 200, description: "Lembrete marcado como concluído" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  markAsDone(@Param("id") id: string, @CurrentUser() user: any) {
    return this.healthService.markAsDone(id, user.sub);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remover um lembrete de saúde" })
  @ApiParam({ name: "id", description: "ID do lembrete" })
  @ApiResponse({ status: 200, description: "Lembrete removido com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  remove(@Param("id") id: string, @CurrentUser() user: any) {
    return this.healthService.remove(id, user.sub);
  }
}
