import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import { SignInDto } from './dto/signin.dto';
import jwtConfig from './config/jwt-config';
import type{ ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {
    console.log(this.jwtConfiguration);
  }


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

      const token = await this.jwtService.signAsync(
        {
        sub: user.id,
        email: user.email,
        },
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          expiresIn: this.jwtConfiguration.jwtTtl,
        }
      )

      return{ 
        email: user.email,
        name: user.name,
        token: token,
      }



    } catch (error) {
      // instanceof verifica se o erro é uma instância dessa classe (ou herda dela)
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Erro ao atualizar usuário", 500)
    }
  }

}
