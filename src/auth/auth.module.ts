import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingServiceProtocol } from './hash/hashing.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BcryptService } from './hash/bcrypt.service';
import jwtConfig from './config/jwt-config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),

  ],
  providers: [{
      provide: HashingServiceProtocol,
      useClass: BcryptService
    },
    AuthService
  ],
  exports: [
    HashingServiceProtocol,
    JwtModule,
    ConfigModule
  ],
  controllers: [AuthController]
})
export class AuthModule {}
