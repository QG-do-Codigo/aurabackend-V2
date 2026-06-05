import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthTokenGuard } from "src/auth/guard/auth.token.guard";
import { CurrentUser } from "src/decorators/CurrentUser";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { MonthlyEvolutionQueryDto } from "./dto/monthly-evolution-query.dto";
import { SummaryQueryDto } from "./dto/summary-query.dto";
import { TransactionsQueryDto } from "./dto/transactions-query.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { FinanceService } from "./finance.service";

function assertUuid(id: string) {
  const ok =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (!ok) {
    throw new UnprocessableEntityException({
      message: "Parâmetro 'id' inválido",
      details: "Use um UUID válido",
    });
  }
}

@UseGuards(AuthTokenGuard)
@ApiTags("Finance")
@Controller("finance")
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @ApiOperation({ summary: "Listar categorias financeiras (seed fixo)" })
  @ApiResponse({ status: 200, description: "Categorias listadas com sucesso" })
  @Get("categories")
  listCategories() {
    return this.financeService.listCategories();
  }

  @ApiOperation({ summary: "Listar transações do usuário autenticado" })
  @ApiQuery({
    name: "period",
    required: false,
    enum: ["mensal", "anual"],
    description: "Período (mês atual / ano atual)",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Página (tamanho 20)",
  })
  @ApiQuery({
    name: "type",
    required: false,
    enum: ["income", "expense"],
    description: "Filtrar por tipo",
  })
  @ApiResponse({ status: 200, description: "Transações listadas com sucesso" })
  @Get("transactions")
  listTransactions(
    @CurrentUser() user: any,
    @Query() query: TransactionsQueryDto
  ) {
    return this.financeService.listTransactions(user.sub, query);
  }

  @ApiOperation({ summary: "Criar transação" })
  @ApiResponse({ status: 201, description: "Transação criada com sucesso" })
  @ApiResponse({ status: 422, description: "Erro de validação" })
  @Post("transactions")
  createTransaction(@CurrentUser() user: any, @Body() dto: CreateTransactionDto) {
    return this.financeService.createTransaction(user.sub, dto);
  }

  @ApiOperation({ summary: "Atualizar transação (parcial)" })
  @ApiResponse({ status: 200, description: "Transação atualizada com sucesso" })
  @ApiResponse({ status: 404, description: "Transação não encontrada" })
  @ApiResponse({ status: 422, description: "Erro de validação" })
  @Put("transactions/:id")
  updateTransaction(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body() dto: UpdateTransactionDto
  ) {
    assertUuid(id);
    return this.financeService.updateTransaction(user.sub, id, dto);
  }

  @ApiOperation({ summary: "Excluir transação" })
  @ApiResponse({ status: 204, description: "Transação excluída com sucesso" })
  @ApiResponse({ status: 404, description: "Transação não encontrada" })
  @Delete("transactions/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(@CurrentUser() user: any, @Param("id") id: string) {
    assertUuid(id);
    await this.financeService.deleteTransaction(user.sub, id);
  }

  @ApiOperation({ summary: "Resumo financeiro do período" })
  @ApiQuery({
    name: "period",
    required: false,
    enum: ["mensal", "anual"],
  })
  @ApiResponse({ status: 200, description: "Resumo retornado com sucesso" })
  @Get("summary")
  summary(@CurrentUser() user: any, @Query() query: SummaryQueryDto) {
    return this.financeService.summary(user.sub, query);
  }

  @ApiOperation({ summary: "Evolução mensal (income/expense)" })
  @ApiQuery({
    name: "months",
    required: false,
    enum: [6, 12],
    description: "Quantidade de meses (default 6)",
  })
  @ApiResponse({ status: 200, description: "Evolução retornada com sucesso" })
  @Get("monthly-evolution")
  monthlyEvolution(
    @CurrentUser() user: any,
    @Query() query: MonthlyEvolutionQueryDto
  ) {
    return this.financeService.monthlyEvolution(user.sub, query);
  }
}

