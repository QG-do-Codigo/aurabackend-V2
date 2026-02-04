import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingServiceProtocol } from './hash/hashing.service';
import { ConfigModule } from '@nestjs/config';
import { BcryptService } from './hash/bcrypt.service';

@Global()
@Module({
  providers: [{
      provide: HashingServiceProtocol,
      useClass: BcryptService
    },
    AuthService
  ],
  controllers: [AuthController],
  exports: [
    HashingServiceProtocol
  ]
})
export class AuthModule {}
