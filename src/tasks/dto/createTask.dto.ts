import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
  @ApiProperty({ example: "Estudar NestJS", description: "Título da tarefa" })
  @IsString()
  title: string;

  @ApiProperty({
    example: "Criar um projeto de exemplo usando NestJS",
    description: "Descrição detalhada da tarefa",
  })
  @IsString()
  description: string;

  @ApiProperty({ example: "Trabalho", description: "Categoria da tarefa" })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: false,
    description: "Indica se a tarefa foi concluída",
    required: false,
  })
  @IsBoolean()
  completed: boolean;

  @ApiProperty({ example: 1, description: "Prioridade da tarefa (1-5)" })
  @IsNumber()
  priority: number;

  @ApiProperty({
    example: "2023-12-31T23:59:59Z",
    description: "Data de vencimento da tarefa (opcional)",
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @IsString()
  @IsOptional()
  userId?: string;
  
  @ApiProperty({
    example: "#FF5733",
    description: "Cor associada à tarefa (opcional)",
    required: false,
  })
  color?: string;
}
