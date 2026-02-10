import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';

import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,

    private readonly hashingService: HashingServiceProtocol

  ) { }

  async GetAllUser() {
    try {
      const users = await this.prismaService.user.findMany(
        {
          select: {
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true
          }
        });

      return users;
    } catch (error) {
      throw new HttpException('Erro ao buscas usuários', 500)
    }
  }

  async GetUser(id: string, tokenPayLoad: PayloadTokenDto){
    try{
      const user = await this.prismaService.user.findFirst({
        where: {
          id: id
        }
      })

      if(!user){
        throw new NotFoundException("Usuário não encontrado")
      }

      console.log(user?.id);
      console.log(tokenPayLoad?.sub);

      if(user?.id !== tokenPayLoad?.sub){
        throw new HttpException("Usuário não autorizado", 403)
      }

      return user;

      
    }catch(error){
      console.log(error);
      if(error instanceof HttpException){
        throw error;
      }

      throw new HttpException("Erro ao buscar usuário", 500)
    }
  }


  async CreateUser(createUserDto: CreateUserDto) {
    try {
      const verifyUser = await this.prismaService.user.findFirst({
        where: {
          email: createUserDto.email
        }
      })

      if (verifyUser) {
        throw new HttpException("Email já cadastrado", 400)
      }

      const passwordHash = await this.hashingService.hash(createUserDto.password);

      const newUser = await this.prismaService.user.create({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          passwordHash: passwordHash
        }
      })

      return newUser;
    } catch (error) {
      // instanceof verifica se o erro é uma instância dessa classe (ou herda dela)
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Erro ao cadastrar usuário", 500)
    }
  }

  async UpdateUser(id: string, updateUserDto: UpdateUserDto, tokenPayLoad: PayloadTokenDto){
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          id: id
        }
      })

      if(!user){throw new NotFoundException("Usuário não encontrado!")}


      if(user?.id !== tokenPayLoad?.sub){
        throw new HttpException("Usuário não autorizadooooooooooooo", 403)
      }

      const dataUser: { name?: string, password?: string} = {
        name:  updateUserDto.name ? updateUserDto.name: user.name
      }

      if(updateUserDto.password){
        const passwordHash = await this.hashingService.hash(updateUserDto.password)
        dataUser["password"] = passwordHash
      }

      const userUpdate = await this.prismaService.user.update({
        where:{
          id: id
        },
        data:{
          name: dataUser.name,
          passwordHash: dataUser?.password ? dataUser.password : user.passwordHash
        }
      })

      return userUpdate

    } catch (error) {
      if(error instanceof HttpException){
        throw error;
      }

      throw new HttpException("Erro atualizar o úsuario!", 500)
    }
  }

  async DeleteUser(id: string, tokenPayLoad: PayloadTokenDto){
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          id: id
        }
      })

      if(!user){
        throw new NotFoundException("Usuário não encontrado!")
      }

      if(user?.id !== tokenPayLoad?.sub){
        throw new HttpException("Usuário não autorizado!", 403)
      }

      await this.prismaService.user.delete({
        where: {
          id: id
        }
      })

      return "Usuário deletado com sucesso!"
      
    } catch (error) {
      if(error instanceof HttpException){
        throw error;
      }

      throw new HttpException("Erro ao tentar deletar o usuário!", 500)
    }
  }
}



