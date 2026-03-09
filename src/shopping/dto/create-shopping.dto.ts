import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

export class CreateShoppingDto {
  @ApiProperty({
    example: "Leite",
    description: "Nome do item a ser comprado",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "2 litros",
    description: "Quantidade do item a ser comprado",
  })
  @IsString()
  quantity: string;

  @ApiProperty({
    example: false,
    description: "Indica se o item foi comprado",
  })
  @IsBoolean()
  purchased: boolean;

  @ApiProperty({
    example: "a1b2c3d4-e5f6-7890-ab12-34567890cdef",
    description: "ID da categoria do item",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoryId?: string;

  @ApiProperty({
    example: "hortifruti",
    description: "Nome da categoria (alias para categoryId)",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category?: string;
}
