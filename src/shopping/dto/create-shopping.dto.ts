import { IsString, IsBoolean, IsNotEmpty } from "class-validator";

export class CreateShoppingDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  quantity: string;

  @IsBoolean()
  purchased: boolean;
}
