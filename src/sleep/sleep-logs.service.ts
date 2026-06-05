import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { UpsertSleepLogDto } from "./dto/upsert-sleep-log.dto";

type SleepRange = "7d" | "30d" | "90d";

const GOAL_HOURS = 8;

function parseRange(range?: string): SleepRange {
  if (!range) return "7d";
  if (range === "7d" || range === "30d" || range === "90d") return range;
  throw new UnprocessableEntityException({
    message: "Parâmetro 'range' inválido",
    details: "Use: 7d, 30d ou 90d",
  });
}

function rangeToDays(range: SleepRange) {
  if (range === "7d") return 7;
  if (range === "30d") return 30;
  return 90;
}

@Injectable()
export class SleepLogsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertTableExists() {
    // Erro comum quando a migration ainda não foi aplicada.
    // Preferimos dar uma mensagem clara.
    try {
      await this.prisma.$queryRaw`SELECT 1 FROM "sleep_logs" LIMIT 1`;
    } catch {
      throw new UnprocessableEntityException({
        message: "Tabela sleep_logs não encontrada",
        details:
          "Aplique as migrations do Prisma antes de usar o módulo de sono.",
      });
    }
  }

  async upsert(userId: string, dto: UpsertSleepLogDto) {
    await this.assertTableExists();

    const factors = dto.factors ?? [];
    const notes = dto.notes ?? null;

    const factorsSql =
      factors.length === 0
        ? Prisma.sql`ARRAY[]::text[]`
        : Prisma.sql`ARRAY[${Prisma.join(factors)}]::text[]`;

    let rows: Array<{
      id: string;
      user_id: string;
      log_date: string;
      bedtime: string;
      wake_time: string;
      duration_h: string;
      quality: number;
      factors: string[];
      notes: string | null;
      created_at: string;
    }>;

    try {
      rows = await this.prisma.$queryRaw(Prisma.sql`
        INSERT INTO "sleep_logs" (
          "user_id",
          "log_date",
          "bedtime",
          "wake_time",
          "quality",
          "factors",
          "notes"
        )
        VALUES (
          ${userId},
          ${dto.log_date}::date,
          ${dto.bedtime}::time,
          ${dto.wake_time}::time,
          ${dto.quality}::smallint,
          ${factorsSql},
          ${notes}
        )
        ON CONFLICT ("user_id", "log_date") DO UPDATE
        SET
          "bedtime" = EXCLUDED."bedtime",
          "wake_time" = EXCLUDED."wake_time",
          "quality" = EXCLUDED."quality",
          "factors" = EXCLUDED."factors",
          "notes" = EXCLUDED."notes"
        RETURNING
          "id",
          "user_id",
          "log_date"::text,
          "bedtime"::text,
          "wake_time"::text,
          "duration_h"::text,
          "quality",
          "factors",
          "notes",
          "created_at"::text
      `);
    } catch (err: any) {
      const message = typeof err?.message === "string" ? err.message : "";
      throw new UnprocessableEntityException({
        message: "Não foi possível salvar o registro de sono",
        details: message || "Erro inesperado ao salvar no banco",
      });
    }

    return rows[0];
  }

  async list(userId: string, range?: string) {
    await this.assertTableExists();
    const parsedRange = parseRange(range);
    const days = rangeToDays(parsedRange);

    const rows = await this.prisma.$queryRaw<
      Array<{
        log_date: string;
        bedtime: string;
        wake_time: string;
        duration_h: string;
        quality: number;
        factors: string[];
        notes: string | null;
      }>
    >(Prisma.sql`
      SELECT
        "log_date"::text,
        "bedtime"::text,
        "wake_time"::text,
        "duration_h"::text,
        "quality",
        "factors",
        "notes"
      FROM "sleep_logs"
      WHERE "user_id" = ${userId}
        AND "log_date" >= (CURRENT_DATE - (${days}::int - 1))
        AND "log_date" <= CURRENT_DATE
      ORDER BY "log_date" DESC
    `);

    return rows;
  }

  async getByDate(userId: string, logDate: string) {
    await this.assertTableExists();

    const rows = await this.prisma.$queryRaw<
      Array<{
        log_date: string;
        bedtime: string;
        wake_time: string;
        duration_h: string;
        quality: number;
        factors: string[];
        notes: string | null;
      }>
    >(Prisma.sql`
      SELECT
        "log_date"::text,
        "bedtime"::text,
        "wake_time"::text,
        "duration_h"::text,
        "quality",
        "factors",
        "notes"
      FROM "sleep_logs"
      WHERE "user_id" = ${userId}
        AND "log_date" = ${logDate}::date
      LIMIT 1
    `);

    const row = rows[0];
    if (!row) {
      throw new NotFoundException("Registro de sono não encontrado para esta data");
    }
    return row;
  }

  async remove(userId: string, logDate: string) {
    await this.assertTableExists();

    const rows = await this.prisma.$queryRaw<
      Array<{
        deleted: number;
      }>
    >(Prisma.sql`
      WITH deleted AS (
        DELETE FROM "sleep_logs"
        WHERE "user_id" = ${userId}
          AND "log_date" = ${logDate}::date
        RETURNING 1
      )
      SELECT count(*)::int AS deleted FROM deleted
    `);

    if ((rows[0]?.deleted ?? 0) === 0) {
      throw new NotFoundException("Registro de sono não encontrado para esta data");
    }

    return { message: "Registro removido com sucesso" };
  }

  async stats(userId: string, range?: string) {
    await this.assertTableExists();
    const parsedRange = parseRange(range);
    const days = rangeToDays(parsedRange);

    const aggregates = await this.prisma.$queryRaw<
      Array<{
        avg_hours: string | null;
        total_logs: number;
        goal_met_count: number;
        best_date: string | null;
        best_hours: string | null;
      }>
    >(Prisma.sql`
      WITH window_logs AS (
        SELECT *
        FROM "sleep_logs"
        WHERE "user_id" = ${userId}
          AND "log_date" >= (CURRENT_DATE - (${days}::int - 1))
          AND "log_date" <= CURRENT_DATE
      ),
      best AS (
        SELECT "log_date"::text AS best_date, "duration_h"::text AS best_hours
        FROM window_logs
        ORDER BY "duration_h" DESC, "log_date" DESC
        LIMIT 1
      )
      SELECT
        (SELECT avg("duration_h")::text FROM window_logs) AS avg_hours,
        (SELECT count(*)::int FROM window_logs) AS total_logs,
        (SELECT count(*)::int FROM window_logs WHERE "duration_h" >= ${GOAL_HOURS}) AS goal_met_count,
        (SELECT best_date FROM best) AS best_date,
        (SELECT best_hours FROM best) AS best_hours
    `);

    const a = aggregates[0] ?? {
      avg_hours: null,
      total_logs: 0,
      goal_met_count: 0,
      best_date: null,
      best_hours: null,
    };

    const logsForStreak = await this.prisma.$queryRaw<
      Array<{ log_date: string; duration_h: string }>
    >(Prisma.sql`
      SELECT "log_date"::text, "duration_h"::text
      FROM "sleep_logs"
      WHERE "user_id" = ${userId}
        AND "log_date" >= (CURRENT_DATE - (${days}::int - 1))
        AND "log_date" <= CURRENT_DATE
        AND "duration_h" >= ${GOAL_HOURS}
      ORDER BY "log_date" DESC
    `);

    let streak = 0;
    if (logsForStreak.length > 0) {
      const dates = new Set(logsForStreak.map((l) => l.log_date));
      let cursor = logsForStreak[0].log_date;
      while (dates.has(cursor)) {
        streak += 1;
        const d = new Date(`${cursor}T00:00:00Z`);
        d.setUTCDate(d.getUTCDate() - 1);
        cursor = d.toISOString().slice(0, 10);
      }
    }

    const avg = a.avg_hours ? Number(a.avg_hours) : 0;
    const bestNight =
      a.best_date && a.best_hours
        ? { date: a.best_date, hours: Number(a.best_hours) }
        : null;

    return {
      avg_hours: Number(avg.toFixed(2)),
      best_night: bestNight,
      goal_met_count: a.goal_met_count ?? 0,
      streak,
      total_logs: a.total_logs ?? 0,
    };
  }
}
