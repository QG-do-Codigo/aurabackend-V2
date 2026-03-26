import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";

export class UpdateHealthDto {
  @ApiPropertyOptional({ description: "Título do lembrete" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: "Descrição do lembrete" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: "Horário do lembrete" })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  time?: Date;

  @ApiPropertyOptional({
    description: "Define se o lembrete se repete diariamente",
  })
  @IsOptional()
  @IsBoolean()
  repeatDaily?: boolean;
}