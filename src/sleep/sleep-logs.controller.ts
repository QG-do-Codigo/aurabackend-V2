import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UnprocessableEntityException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthTokenGuard } from "src/auth/guard/auth.token.guard";
import { CurrentUser } from "src/decorators/CurrentUser";
import { UpsertSleepLogDto } from "./dto/upsert-sleep-log.dto";
import { SleepLogsService } from "./sleep-logs.service";

@UseGuards(AuthTokenGuard)
@ApiTags("Sleep")
@Controller("sleep")
export class SleepLogsController {
  constructor(private readonly sleepLogsService: SleepLogsService) {}

  @ApiOperation({
    summary: "Criar/atualizar registro de sono (upsert por data)",
  })
  @ApiResponse({ status: 201, description: "Registro salvo com sucesso" })
  @ApiResponse({ status: 422, description: "Erro de validação" })
  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) =>
        new UnprocessableEntityException({
          message: "Payload inválido",
          details: errors.flatMap((e) => Object.values(e.constraints ?? {})),
        }),
    })
  )
  upsert(@Body() dto: UpsertSleepLogDto, @CurrentUser() user: any) {
    return this.sleepLogsService.upsert(user.sub, dto);
  }

  @ApiOperation({ summary: "Listar registros de sono do usuário autenticado" })
  @ApiQuery({
    name: "range",
    required: false,
    description: "Janela de consulta",
    enum: ["7d", "30d", "90d"],
  })
  @ApiResponse({ status: 200, description: "Registros listados com sucesso" })
  @ApiResponse({ status: 422, description: "Erro de validação" })
  @Get()
  list(
    @CurrentUser() user: any,
    @Query("range") range?: string
  ) {
    return this.sleepLogsService.list(user.sub, range);
  }

  @ApiOperation({ summary: "Retornar estatísticas de sono" })
  @ApiQuery({
    name: "range",
    required: false,
    description: "Janela de consulta",
    enum: ["7d", "30d", "90d"],
  })
  @ApiResponse({ status: 200, description: "Estatísticas retornadas com sucesso" })
  @ApiResponse({ status: 422, description: "Erro de validação" })
  @Get("stats")
  stats(@CurrentUser() user: any, @Query("range") range?: string) {
    return this.sleepLogsService.stats(user.sub, range);
  }

  @ApiOperation({ summary: "Buscar registro de sono por data (YYYY-MM-DD)" })
  @ApiResponse({ status: 200, description: "Registro retornado com sucesso" })
  @ApiResponse({ status: 404, description: "Registro não encontrado" })
  @ApiResponse({ status: 422, description: "Erro de validação" })
  @Get(":log_date")
  getByDate(@CurrentUser() user: any, @Param("log_date") logDate: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(logDate)) {
      throw new UnprocessableEntityException({
        message: "Parâmetro 'log_date' inválido",
        details: "Use o formato YYYY-MM-DD",
      });
    }
    return this.sleepLogsService.getByDate(user.sub, logDate);
  }

  @ApiOperation({ summary: "Remover registro de sono por data (YYYY-MM-DD)" })
  @ApiResponse({ status: 200, description: "Registro removido com sucesso" })
  @ApiResponse({ status: 404, description: "Registro não encontrado" })
  @ApiResponse({ status: 422, description: "Erro de validação" })
  @Delete(":log_date")
  remove(@CurrentUser() user: any, @Param("log_date") logDate: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(logDate)) {
      throw new UnprocessableEntityException({
        message: "Parâmetro 'log_date' inválido",
        details: "Use o formato YYYY-MM-DD",
      });
    }
    return this.sleepLogsService.remove(user.sub, logDate);
  }
}

