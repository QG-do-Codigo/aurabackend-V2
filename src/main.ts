import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { HttpStatus, UnprocessableEntityException, ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors) =>
        new UnprocessableEntityException({
          message: "Payload inválido",
          details: errors.flatMap((e) => Object.values(e.constraints ?? {})),
        }),
    })
  );

  const config = new DocumentBuilder()
    .setTitle("Aura API")
    .setDescription("API de gerenciamento de tarefas")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        in: "header",
      },
      "access-token"
    )
    .addSecurityRequirements("access-token")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
