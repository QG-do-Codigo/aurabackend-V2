import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "src/user/user.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { TaskModule } from "src/tasks/task.module";
import { NoteModule } from "src/note/note.module";

@Module({
  imports: [PrismaModule, AuthModule, UserModule, TaskModule, NoteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
