import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { dot } from 'node:test/reporters';
import { ValidationPipe } from "@nestjs/common/pipes";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //se TRUE ele remove as chaves que não estão no DTO
    transform: false, //transforma os tipos primitivos (string, number, boolean) conforme definido no DTO
  }
))
  await app.listen(process.env.PORT ?? 3000);
  
}
bootstrap();
