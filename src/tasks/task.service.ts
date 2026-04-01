import { HttpException, Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/createTask.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateTaskDto } from "./dto/updateTask.dto";
import { PayloadTokenDto } from "src/auth/dto/payload-token.dto";
import { Category } from "@prisma/client";

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(createTaskDto: CreateTaskDto, tokenPayLoad: PayloadTokenDto) {
    try {
      if (!createTaskDto) {
        throw new Error("createTaskDto is undefined");
      }

      const newTask = this.prisma.task.create({
        data: {
          title: createTaskDto.title,
          description: createTaskDto.description,
          category: createTaskDto.category,
          completed: createTaskDto.completed,
          priority: createTaskDto.priority,
          dueDate: createTaskDto.dueDate,
          color: createTaskDto.color,
          userId: tokenPayLoad.sub,
        },
      });

      return newTask
    } catch (error) {
      console.log("Error creating task:", error);
    }
  }

  async getTasksByUser(
  userId: string,
  category?: Category,
) {
  return this.prisma.task.findMany({
    where: {
      userId,
      ...(category && { category }),
    },
  });
}

async getTasksByCategory(
  category: Category,
  tokenPayLoad: PayloadTokenDto,
) {
  try {
    if (!tokenPayLoad.sub) {
      throw new HttpException("Usuário não logado!", 400);
    }

    const tasks = await this.prisma.task.findMany({
      where: {
        userId: tokenPayLoad.sub,
        category: category,
      },
    });

    return tasks;
  } catch (error) {
    console.log("Error fetching tasks by category:", error);
  }
}

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
  const updated = await this.prisma.task.update({
    where: { id },
    data: {
      ...updateTaskDto,
    },
  });
  return updated;
}

  async deleteTask(id: string, tokenPayLoad: PayloadTokenDto) {
    return this.prisma.task.delete({ 
      where: { 
        id,
        userId: tokenPayLoad.sub
      } 
    });
  }

  async deleteAllTasks(userId: string) {

    return this.prisma.task.deleteMany({ where: { userId } });
  }
}
