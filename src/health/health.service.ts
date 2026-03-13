import { Injectable } from "@nestjs/common";
import { CreateHealthDto } from "./dto/create-health.dto";
import { UpdateHealthDto } from "./dto/update-health.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHealthDto: CreateHealthDto, userId: string) {
    return this.prisma.healthReminder.create({
      data: {
        title: createHealthDto.title,
        description: createHealthDto.description,
        time: createHealthDto.time,
        repeatDaily: createHealthDto.repeatDaily,
        userId: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.healthReminder.findMany();
  }

  async findOne(id: string) {
    return this.prisma.healthReminder.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateHealthDto: UpdateHealthDto) {
    try {
      return this.prisma.healthReminder.update({
        where: { id },
        data: updateHealthDto,
      });
    } catch (error) {
      console.error("Error updating health reminder:", error);
    }
  }

  async remove(id: string) {
    return this.prisma.healthReminder.delete({
      where: { id },
    });
  }
}
