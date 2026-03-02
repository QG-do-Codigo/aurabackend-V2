import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthTokenGuard } from './guard/auth.token.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @ApiOperation({ summary: "Realizar Login do usúario."})
  @ApiResponse({ status: 201, description: "Login Realizado com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado"})
  @Post('signin')
  SignIn(@Body() signInDto: SignInDto) {
    return this.authService.SignIn(signInDto);
  }

@ApiOperation({ summary: "Fazer logout do usuário" })
  @ApiResponse({ status: 200, description: "Logout efetuado com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @Post('logout')
  @UseGuards(AuthTokenGuard)
  SignOut(@Req() req: Request) {
    const authorization = req.headers.authorization as string | undefined;
    const token = authorization ? authorization.split(' ')[1] : undefined;
    return this.authService.SignOut(token);
  }

}
