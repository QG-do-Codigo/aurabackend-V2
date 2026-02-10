import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {

  @ApiProperty({ example: "Juliana Almeida", description: "Nome do usúario" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "Email do usúario", description:"Email do usúario"})
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "Senha do usúario", description:"Senha do usuario"})
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}