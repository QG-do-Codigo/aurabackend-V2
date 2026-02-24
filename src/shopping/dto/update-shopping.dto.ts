import { IsBoolean, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateShoppingDto {
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
}
