import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from "class-validator";

export class UpdateTransactionDto {
  @ApiProperty({
    example: "Aluguel",
    description: "Nome da transação",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name?: string;

  @ApiProperty({
    example: 1500.0,
    description: "Valor (sempre positivo)",
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: "amount deve ser um número" })
  @Min(0.01, { message: "amount deve ser maior que 0" })
  amount?: number;

  @ApiProperty({
    example: "expense",
    description: "Tipo da transação",
    enum: ["income", "expense"],
    required: false,
  })
  @IsOptional()
  @IsIn(["income", "expense"], {
    message: "type deve ser 'income' ou 'expense'",
  })
  type?: "income" | "expense";

  @ApiProperty({
    example: 3,
    description: "ID da categoria (finance_categories.id)",
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "category_id deve ser um número inteiro" })
  @Min(1, { message: "category_id deve ser maior que 0" })
  category_id?: number;

  @ApiProperty({
    example: "2026-03-05",
    description: "Data da transação (YYYY-MM-DD)",
    required: false,
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "transaction_date deve estar no formato YYYY-MM-DD",
  })
  transaction_date?: string;

  @ApiProperty({
    example: "Pago via PIX",
    description: "Observações",
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
