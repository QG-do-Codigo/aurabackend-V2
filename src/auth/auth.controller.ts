import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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

}
