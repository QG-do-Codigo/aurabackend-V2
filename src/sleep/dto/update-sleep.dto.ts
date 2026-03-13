import { Type } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateSleepDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  goalHours?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  averageHours?: number;

  @IsOptional()
  @IsString()
  bedtimeRoutine?: string;

  @IsOptional()
  @IsDateString()
  alarmTime?: string;
}
