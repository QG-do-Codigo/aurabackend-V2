import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/createTask.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateTaskDto } from "./dto/updateTask.dto";

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(createTaskDto: CreateTaskDto, userId: string) {
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
          userId: userId,
        },
      });
    } catch (error) {
      console.log("Error creating task:", error);
    }
  }

  async getTasksByUser(userId: string) {
    try {
      const tasks = await this.prisma.task.findMany({
        where: { userId: userId },
      });
      return tasks;
    } catch (error) {
      throw error;
    }
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
