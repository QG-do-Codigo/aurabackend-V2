import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignInDto{

  @ApiProperty({ example: "teste@2000@gmail.com", description: "Email para realizar Login" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Teste@123", description: "Senha com no minimo 6 caracteres" })
  @IsString()
  @MinLength(6)
  password: string;
}