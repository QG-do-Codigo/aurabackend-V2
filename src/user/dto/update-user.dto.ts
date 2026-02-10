import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto extends PartialType(CreateUserDto){

    @ApiProperty({ example: "Juliana Almeida", description: "Nome do usúario" })
    @IsString()
    @IsNotEmpty()
    name: string;


    @ApiProperty({ example: "Senha do usúario", description:"Senha do usuario"})
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;
}