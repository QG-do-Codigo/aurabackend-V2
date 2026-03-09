import { Module } from "@nestjs/common";
import { TasksController } from "./task.controller";
import { TaskService } from "./task.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  exports: [],
  imports: [AuthModule],
  controllers: [TasksController],
  providers: [TaskService, PrismaService],
})
export class TaskModule {}
