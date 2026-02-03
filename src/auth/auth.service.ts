import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol
  ) {}


  async SignIn(signInDto: SignInDto){
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: signInDto.email
        }
      })

      if(!user){
        throw new HttpException('Login ou senha inválidos', 401);
      }

      const passwordMatch = await this.hashingService.compare(signInDto.password, user.passwordHash);

      if(!passwordMatch){
        throw new HttpException('Login ou senha inválidos', 401);
      }



    } catch (error) {
      console.log(error);
      throw new HttpException('Erro ao realizar login', 500);
    }
  }

}
