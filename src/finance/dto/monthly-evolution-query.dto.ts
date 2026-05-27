import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, Min } from "class-validator";

export class MonthlyEvolutionQueryDto {
  @ApiProperty({ required: false, enum: [6, 12], default: 6 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "months deve ser um inteiro" })
  @IsIn([6, 12], { message: "months deve ser 6 ou 12" })
  @Min(1, { message: "months deve ser no mínimo 1" })
  months?: number;
}

