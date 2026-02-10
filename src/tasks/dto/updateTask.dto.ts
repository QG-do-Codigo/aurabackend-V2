import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTaskDto {
  @ApiProperty({ example: "Estudar NestJS", description: "Título da tarefa" })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: "Criar um projeto de exemplo usando NestJS",
    description: "Descrição detalhada da tarefa",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: "Trabalho", description: "Categoria da tarefa" })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    example: false,
    description: "Indica se a tarefa foi concluída",
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiProperty({ example: 1, description: "Prioridade da tarefa (1-5)" })
  @IsNumber()
  @IsOptional()
  priority?: number;

  @ApiProperty({
    example: "2023-12-31T23:59:59Z",
    description: "Data de vencimento da tarefa (opcional)",
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dueDate?: Date;
}
