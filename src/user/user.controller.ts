import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';


@Controller('users')
export class UserController {
  constructor(


    private readonly userService: UserService
  ){}

  @Get()
  GetAllUser(){
    return this.userService.GetAllUser();
  }

  @Post()
  CreateUser(@Body() createUserDto: CreateUserDto){
    return this.userService.CreateUser(createUserDto);
  }
}
