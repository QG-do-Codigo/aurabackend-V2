import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TOKEN_PAYLOAD_PARAM } from 'src/auth/param/token-payload-param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth.token.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('users')
export class UserController {
  constructor(


    private readonly userService: UserService
  ){}

  @ApiOperation({ summary: "Listar todos os usuario."})
  @ApiResponse({ status: 200, description: "Retorna todos os usúarios." })
  @Get()
  GetAllUser(){
    return this.userService.GetAllUser();
  }

  @ApiOperation({ summary: "Listar usuario."})
  @ApiResponse({ status: 200, description: "Retorna o usúario pelo ID" })
  @ApiResponse({ status: 404, description: "Usúario não encontrado"})
  @UseGuards(AuthTokenGuard)
  @Get(":id")
  GetUser(
    @Param("id", ParseUUIDPipe)
    id: string,
    @TOKEN_PAYLOAD_PARAM() tokenPayLoad: PayloadTokenDto
  ){
    return this.userService.GetUser(id, tokenPayLoad)
  }

  @ApiOperation({ summary: "Cadastrar Usúario."})
  @ApiResponse({ status: 201, description: "Cadastrar um novo usúario" })
  @Post()
  CreateUser(@Body() createUserDto: CreateUserDto){
    return this.userService.CreateUser(createUserDto);
  }

  @ApiOperation({ summary: "Atualizar Usúario."})
  @ApiResponse({ status: 201, description: "Atualizado um usúario" })
  @UseGuards(AuthTokenGuard)
  @Patch(":id")
  UpdateUser(
  @Body() updateUserDto: UpdateUserDto,
  @Param("id", ParseUUIDPipe)
    id: string,
  @TOKEN_PAYLOAD_PARAM() tokenPayLoad: PayloadTokenDto,
  )
{
    return this.userService.UpdateUser(id, updateUserDto, tokenPayLoad)
  }

  @ApiOperation({ summary: "Deletar Usúario."})
  @ApiResponse({ status: 201, description: "Deletado com sucesso" })
  @UseGuards(AuthTokenGuard)
  @Delete(":id")
  DeleteUser(
  @Param("id", ParseUUIDPipe)
  id: string,
  @TOKEN_PAYLOAD_PARAM() tokenPayLoad: PayloadTokenDto,
  ){
    return this.userService.DeleteUser(id, tokenPayLoad)
  }
}
