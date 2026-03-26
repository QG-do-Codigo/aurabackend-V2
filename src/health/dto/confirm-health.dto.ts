import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsUUID } from "class-validator";

export class ConfirmHealthDto {
  @ApiProperty({ description: "ID do lembrete" })
  @IsUUID()
  reminderId: string;

  @ApiProperty({ description: "Data do evento" })
  @Type(() => Date)
  @IsDate()
  date: Date;
}

