import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, Min } from "class-validator";

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
}

