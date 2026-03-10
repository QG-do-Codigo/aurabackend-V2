import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from "class-validator";
import { Transform } from "class-transformer";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class AddShoppingItemDto {
  @ApiProperty({
    example: "Arroz",
    description: "Nome do novo item",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "1 pacote",
    description: "Quantidade do novo item",
    required: false,
  })
  @IsOptional()
  @IsString()
  quantity?: string;
}

export class UpdateShoppingDto {
  @ApiProperty({
    example: "Leite",
    description: "Nome do item",
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    example: "2 litros",
    description: "Quantidade do item",
    required: false,
  })
  @IsOptional()
  @IsString()
  quantity?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  @ApiProperty({
    example: true,
    description: "Indica se o item foi comprado",
    required: false,
  })
  @IsBoolean()
  purchased?: boolean;

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

  @ApiProperty({
    type: [AddShoppingItemDto],
    required: false,
    description: "Lista de novos itens para adicionar durante a edição",
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AddShoppingItemDto)
  items?: AddShoppingItemDto[];
}
