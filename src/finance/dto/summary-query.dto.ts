import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";

export class SummaryQueryDto {
  @ApiProperty({
    required: false,
    enum: ["mensal", "anual"],
    default: "mensal",
  })
  @IsOptional()
  @IsIn(["mensal", "anual"], { message: "period deve ser 'mensal' ou 'anual'" })
  period?: "mensal" | "anual";
}

