import { IsOptional, IsString } from 'class-validator';

export class FindTasksDto {
  @IsOptional()
  @IsString()
  title?: string;  // busca parcial no título
}