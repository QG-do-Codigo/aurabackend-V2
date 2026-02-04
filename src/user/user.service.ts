import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';

import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { CreateUserDto } from './dto/create-user.dto';

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
        },
        select: {
          email: true,
          name: true
        }
      })

      return newUser;
    } catch (error) {
      // instanceof verifica se o erro é uma instância dessa classe (ou herda dela)
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Erro ao atualizar usuário", 500)
    }
  }
}



