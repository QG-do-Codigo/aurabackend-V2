import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsString } from "class-validator";

export class CreateHealthDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @Type(() => Date)
  @IsDate()
  time: Date;

  @IsBoolean()
  repeatDaily: boolean;
}
