import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { dot } from 'node:test/reporters';
import { ValidationPipe } from "@nestjs/common/pipes";
import { DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //se TRUE ele remove as chaves que não estão no DTO
    transform: false, //transforma os tipos primitivos (string, number, boolean) conforme definido no DTO
  }
))

  const config = new DocumentBuilder()
    .setTitle('AURA')
    .setDescription('Projeto com o objetivo de controlar seu dia a dia além de auxiliar no seu bem estar')
    .setVersion('1.0')
    .addTag('docs')
    .build()

  await app.listen(process.env.PORT ?? 3000);
  
}
bootstrap();
