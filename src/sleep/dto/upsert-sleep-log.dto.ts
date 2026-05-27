import { Type } from "class-transformer";
import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from "class-validator";
import { SLEEP_FACTORS, SleepFactor } from "../constants/sleep-factors";

export class UpsertSleepLogDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "log_date deve estar no formato YYYY-MM-DD",
  })
  log_date: string;

  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
    message: "bedtime deve estar no formato HH:MM (00:00–23:59)",
  })
  bedtime: string;

  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
    message: "wake_time deve estar no formato HH:MM (00:00–23:59)",
  })
  wake_time: string;

  @Type(() => Number)
  @IsInt({ message: "quality deve ser um inteiro (1–5)" })
  @Min(1, { message: "quality deve ser no mínimo 1" })
  @Max(5, { message: "quality deve ser no máximo 5" })
  quality: number;

  @IsOptional()
  @IsArray({ message: "factors deve ser uma lista de strings" })
  @ArrayUnique({ message: "factors não pode conter valores repetidos" })
  @IsIn(SLEEP_FACTORS, {
    each: true,
    message: `factors contém valor inválido. Permitidos: ${SLEEP_FACTORS.join(", ")}`,
  })
  factors?: SleepFactor[];

  @IsOptional()
  @IsString({ message: "notes deve ser texto" })
  notes?: string;
}
