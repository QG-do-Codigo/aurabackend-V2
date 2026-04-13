import { IsString, IsNotEmpty } from "class-validator";

export class CreateIdeaDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  content!: string;

  @IsString()
  categoryId!: string;
}
