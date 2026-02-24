import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsNotEmpty } from "class-validator";

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
}
