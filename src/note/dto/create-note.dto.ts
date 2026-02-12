import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNoteDto {
  @ApiProperty({ example: "Compras Supermercado", description:"Titulo para a tarefa em si"})
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: "Comprar os seguintes itens: 1- Leite, 2- Manteiga, 3- Pão",description: "Conteúdo que irá ter dentro da nota."})
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty({ example: "#000080" ,description: "Cor que deseja que seja o card"})
  @IsString()
  @IsOptional()
  color?: string
}
