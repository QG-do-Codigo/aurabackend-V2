import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, Matches, Max, Min } from "class-validator";

export class TransactionsQueryDto {
  @ApiProperty({
    required: false,
    enum: ["mensal", "anual"],
    default: "mensal",
  })
  @IsOptional()
  @IsIn(["mensal", "anual"], { message: "period deve ser 'mensal' ou 'anual'" })
  period?: "mensal" | "anual";

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "page deve ser um inteiro" })
  @Min(1, { message: "page deve ser no mínimo 1" })
  page?: number;

  @ApiProperty({
    required: false,
    enum: ["income", "expense"],
  })
  @IsOptional()
  @IsIn(["income", "expense"], { message: "type deve ser 'income' ou 'expense'" })
  type?: "income" | "expense";

  @ApiProperty({
    required: false,
    example: "2026-03-05",
    description: "Filtrar por data exata da transação (YYYY-MM-DD)",
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "date deve estar no formato YYYY-MM-DD",
  })
  date?: string;

  @ApiProperty({
    required: false,
    example: 3,
    description: "Filtrar por mês da transação (1 a 12)",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "month deve ser um inteiro" })
  @Min(1, { message: "month deve ser no mínimo 1" })
  @Max(12, { message: "month deve ser no máximo 12" })
  month?: number;

  @ApiProperty({
    required: false,
    example: 2026,
    description: "Filtrar por ano da transação",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "year deve ser um inteiro" })
  @Min(1, { message: "year deve ser no mínimo 1" })
  @Max(9999, { message: "year deve ser no máximo 9999" })
  year?: number;

  @ApiProperty({
    required: false,
    example: 3,
    description: "Filtrar por ID da categoria",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "category_id deve ser um número inteiro" })
  @Min(1, { message: "category_id deve ser maior que 0" })
  category_id?: number;
}
