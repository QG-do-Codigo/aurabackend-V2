import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/createTask.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateTaskDto } from "./dto/updateTask.dto";

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(createTaskDto: CreateTaskDto) {
    try {
      if (!createTaskDto) {
        throw new Error("createTaskDto is undefined");
      }
      return this.prisma.task.create({
        data: {
          title: createTaskDto.title,
          description: createTaskDto.description,
          category: createTaskDto.category,
          completed: createTaskDto.completed,
          priority: createTaskDto.priority,
          dueDate: createTaskDto.dueDate,
          //user fixo enquanto task de autenticação n esta pronta
          user: { connect: { id: "edee1e04-01b4-492b-bccc-ecc5e63079c7" } },
        },
      });
    } catch (error) {
      console.log("Error creating task:", error);
    }
  }

  async getTasks() {
    return this.prisma.task.findMany({});
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const updated = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
    return updated;
  }

  async deleteTask(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
