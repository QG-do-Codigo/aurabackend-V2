import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { HealthType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from "class-validator";

export class CreateHealthDto {
  @ApiProperty({ description: "Título do lembrete" })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: "Descrição do lembrete" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Tipo do lembrete",
    enum: HealthType,
  })
  @IsEnum(HealthType)
  type: HealthType;

  @ApiProperty({ description: "Horário do lembrete" })
  @Type(() => Date)
  @IsDate()
  time: Date;

  @ApiProperty({ description: "Se o lembrete se repete diariamente" })
  @IsBoolean()
  repeatDaily: boolean;
}