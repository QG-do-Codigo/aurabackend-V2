import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { ApiExceptionFilter } from 'src/common/filters/exception-filter';

@Module({
  imports: [PrismaModule],
  providers: [
    UserService,
     {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter
    }

    ],
  controllers: [UserController]
})
export class UserModule {}
