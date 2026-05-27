import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma, Transaction } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { MonthlyEvolutionQueryDto } from "./dto/monthly-evolution-query.dto";
import { SummaryQueryDto } from "./dto/summary-query.dto";
import { TransactionsQueryDto } from "./dto/transactions-query.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";

const PAGE_SIZE = 20;

const FINANCE_CATEGORIES_SEED = [
  { name: "Renda", icon: "💰", type: "income" },
  { name: "Extra", icon: "💼", type: "income" },
  { name: "Moradia", icon: "🏠", type: "expense" },
  { name: "Alimentação", icon: "🛒", type: "expense" },
  { name: "Saúde", icon: "💪", type: "expense" },
  { name: "Mobilidade", icon: "🚗", type: "expense" },
  { name: "Lazer", icon: "🎮", type: "expense" },
  { name: "Educação", icon: "📚", type: "expense" },
  { name: "Vestuário", icon: "👕", type: "expense" },
  { name: "Outros", icon: "📦", type: "expense" },
] as const;

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseISODate(iso: string) {
  const d = new Date(`${iso}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function startOfMonthUtc(year: number, monthIndex0: number) {
  return new Date(Date.UTC(year, monthIndex0, 1, 0, 0, 0, 0));
}

function endOfMonthUtc(year: number, monthIndex0: number) {
  return new Date(Date.UTC(year, monthIndex0 + 1, 0, 0, 0, 0, 0));
}

function startOfYearUtc(year: number) {
  return new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
}

function endOfYearUtc(year: number) {
  return new Date(Date.UTC(year, 11, 31, 0, 0, 0, 0));
}

const MONTHS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const MONTHS_SHORT_PT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  private ensuredSeed: Promise<void> | null = null;

  private async ensureSeedCategories() {
    if (!this.ensuredSeed) {
      this.ensuredSeed = (async () => {
        const count = await this.prisma.financeCategory.count();
        if (count > 0) return;
        await this.prisma.financeCategory.createMany({
          data: FINANCE_CATEGORIES_SEED.map((c) => ({ ...c })),
          skipDuplicates: true,
        });
      })().catch((err) => {
        this.ensuredSeed = null;
        throw err;
      });
    }
    await this.ensuredSeed;
  }

  private assertNotFutureDate(dateIso: string) {
    const d = parseISODate(dateIso);
    if (!d) {
      throw new UnprocessableEntityException({
        message: "transaction_date inválida",
        details: "Use o formato YYYY-MM-DD",
      });
    }
    const todayIso = toISODate(new Date());
    if (dateIso > todayIso) {
      throw new UnprocessableEntityException({
        message: "transaction_date não pode ser futura",
        details: `Data informada: ${dateIso}. Hoje: ${todayIso}`,
      });
    }
  }

  private async validateCategory(categoryId: number, type: "income" | "expense") {
    await this.ensureSeedCategories();
    const category = await this.prisma.financeCategory.findUnique({
      where: { id: categoryId },
      select: { id: true, name: true, icon: true, type: true },
    });

    if (!category) {
      throw new UnprocessableEntityException({
        message: "category_id inválido",
        details: "Categoria não encontrada",
      });
    }

    if (category.type !== type) {
      throw new UnprocessableEntityException({
        message: "category_id inválido",
        details: `Categoria '${category.name}' é do tipo '${category.type}' e não pode ser usada em '${type}'`,
      });
    }

    return category;
  }

  private shapeTransaction(tx: Transaction & { category: any }) {
    return {
      id: tx.id,
      name: tx.name,
      amount: Number(tx.amount),
      type: tx.type,
      category: {
        id: tx.category.id,
        name: tx.category.name,
        icon: tx.category.icon,
      },
      transaction_date:
        tx.transactionDate instanceof Date ? toISODate(tx.transactionDate) : tx.transactionDate,
      notes: tx.notes ?? null,
      created_at: tx.createdAt instanceof Date ? tx.createdAt.toISOString() : tx.createdAt,
    };
  }

  async listCategories() {
    await this.ensureSeedCategories();
    return this.prisma.financeCategory.findMany({
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
  }

  private getPeriodFilter(period: "mensal" | "anual") {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();

    if (period === "mensal") {
      return {
        start: startOfMonthUtc(year, month),
        end: endOfMonthUtc(year, month),
        label: `${MONTHS_PT[month]} ${year}`,
      };
    }

    return { start: startOfYearUtc(year), end: endOfYearUtc(year), label: `${year}` };
  }

  async listTransactions(userId: string, query: TransactionsQueryDto) {
    await this.ensureSeedCategories();

    const period = query.period ?? "mensal";
    const page = query.page ?? 1;
    const type = query.type;

    const { start, end } = this.getPeriodFilter(period);

    const where: Prisma.TransactionWhereInput = {
      userId,
      transactionDate: { gte: start, lte: end },
      ...(type ? { type } : {}),
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.transaction.count({ where }),
      this.prisma.transaction.findMany({
        where,
        orderBy: [{ transactionDate: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          category: { select: { id: true, name: true, icon: true, type: true } },
        },
      }),
    ]);

    return {
      data: items.map((t) => this.shapeTransaction(t as any)),
      total,
      page,
    };
  }

  async createTransaction(userId: string, dto: CreateTransactionDto) {
    const type = dto.type;
    const category = await this.validateCategory(dto.category_id, type);

    const dateIso = dto.transaction_date ?? toISODate(new Date());
    this.assertNotFutureDate(dateIso);

    const created = await this.prisma.transaction.create({
      data: {
        userId,
        name: dto.name,
        amount: dto.amount,
        type,
        categoryId: category.id,
        transactionDate: parseISODate(dateIso)!,
        notes: dto.notes ?? null,
      },
      include: {
        category: { select: { id: true, name: true, icon: true, type: true } },
      },
    });

    return this.shapeTransaction(created as any);
  }

  async updateTransaction(userId: string, id: string, dto: UpdateTransactionDto) {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { category: { select: { id: true, name: true, icon: true, type: true } } },
    });

    if (!existing) {
      throw new NotFoundException("Transação não encontrada");
    }

    const finalType = (dto.type ?? (existing.type as any)) as "income" | "expense";
    const finalCategoryId = dto.category_id ?? existing.categoryId;

    await this.validateCategory(finalCategoryId, finalType);

    if (dto.transaction_date) {
      this.assertNotFutureDate(dto.transaction_date);
    }

    const updated = await this.prisma.transaction.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.category_id !== undefined && { categoryId: dto.category_id }),
        ...(dto.transaction_date !== undefined && {
          transactionDate: parseISODate(dto.transaction_date)!,
        }),
        ...(dto.notes !== undefined && { notes: dto.notes ?? null }),
      },
      include: {
        category: { select: { id: true, name: true, icon: true, type: true } },
      },
    });

    return this.shapeTransaction(updated as any);
  }

  async deleteTransaction(userId: string, id: string) {
    const existing = await this.prisma.transaction.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException("Transação não encontrada");
    }
    await this.prisma.transaction.delete({ where: { id } });
  }

  async summary(userId: string, query: SummaryQueryDto) {
    await this.ensureSeedCategories();

    const period = query.period ?? "mensal";
    const { start, end, label } = this.getPeriodFilter(period);

    const totals = await this.prisma.transaction.groupBy({
      by: ["type"],
      where: { userId, transactionDate: { gte: start, lte: end } },
      _sum: { amount: true },
    });

    const totalIncome = Number(
      totals.find((t) => t.type === "income")?._sum.amount ?? 0
    );
    const totalExpense = Number(
      totals.find((t) => t.type === "expense")?._sum.amount ?? 0
    );

    const byCategory = await this.prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId, transactionDate: { gte: start, lte: end } },
      _sum: { amount: true },
    });

    const categories = await this.prisma.financeCategory.findMany({
      where: { id: { in: byCategory.map((b) => b.categoryId) } },
      select: { id: true, name: true, icon: true, type: true },
    });

    const totalAbs = totalIncome + totalExpense;

    const byCategoryFormatted = byCategory
      .map((b) => {
        const cat = categories.find((c) => c.id === b.categoryId);
        const total = Number(b._sum.amount ?? 0);
        return {
          category_id: b.categoryId,
          name: cat?.name ?? "Desconhecido",
          icon: cat?.icon ?? "❓",
          type: cat?.type ?? "expense",
          total,
          percentage: totalAbs > 0 ? Number(((total / totalAbs) * 100).toFixed(2)) : 0,
        };
      })
      .sort((a, b) => b.total - a.total);

    return {
      total_income: Number(totalIncome.toFixed(2)),
      total_expense: Number(totalExpense.toFixed(2)),
      balance: Number((totalIncome - totalExpense).toFixed(2)),
      period_label: label,
      by_category: byCategoryFormatted,
    };
  }

  async monthlyEvolution(userId: string, query: MonthlyEvolutionQueryDto) {
    await this.ensureSeedCategories();

    const months = query.months ?? 6;
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();

    const points: Array<{ year: number; month: number }> = [];
    for (let i = months - 1; i >= 0; i -= 1) {
      const d = new Date(Date.UTC(year, month - i, 1, 0, 0, 0, 0));
      points.push({ year: d.getUTCFullYear(), month: d.getUTCMonth() });
    }

    const start = startOfMonthUtc(points[0].year, points[0].month);
    const end = endOfMonthUtc(points[points.length - 1].year, points[points.length - 1].month);

    const grouped = await this.prisma.transaction.groupBy({
      by: ["type", "transactionDate"],
      where: { userId, transactionDate: { gte: start, lte: end } },
      _sum: { amount: true },
    });

    const bucket = new Map<string, { income: number; expense: number }>();

    for (const p of points) {
      const key = `${p.year}-${String(p.month + 1).padStart(2, "0")}`;
      bucket.set(key, { income: 0, expense: 0 });
    }

    for (const g of grouped) {
      const d = g.transactionDate as unknown as Date;
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      const current = bucket.get(key);
      if (!current) continue;
      const sum = Number(g._sum.amount ?? 0);
      if (g.type === "income") current.income += sum;
      if (g.type === "expense") current.expense += sum;
    }

    return points.map((p) => {
      const key = `${p.year}-${String(p.month + 1).padStart(2, "0")}`;
      const v = bucket.get(key) ?? { income: 0, expense: 0 };
      return {
        month: MONTHS_SHORT_PT[p.month],
        income: Number(v.income.toFixed(2)),
        expense: Number(v.expense.toFixed(2)),
      };
    });
  }
}
