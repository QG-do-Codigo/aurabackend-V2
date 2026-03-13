import { Injectable } from "@nestjs/common";
import { CreateSleepDto } from "./dto/create-sleep.dto";
import { UpdateSleepDto } from "./dto/update-sleep.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SleepService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSleepDto: CreateSleepDto, userId: string) {
    try {
      return this.prisma.sleepGoal.create({
        data: {
          goalHours: createSleepDto.goalHours,
          averageHours: createSleepDto.averageHours,
          bedtimeRoutine: createSleepDto.bedtimeRoutine,
          alarmTime: createSleepDto.alarmTime
            ? new Date(createSleepDto.alarmTime)
            : null,
          userId: userId,
        },
      });
    } catch (error) {
      console.log("Error creating sleep goal:", error);
    }
  }

  async findAll(userId: string) {
    try {
      return this.prisma.sleepGoal.findMany({ where: { userId: userId } });
    } catch (error) {
      console.log("Error fetching sleep goals:", error);
    }
  }

  async update(id: string, updateSleepDto: UpdateSleepDto, userId: string) {
    return this.prisma.sleepGoal.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        goalHours: updateSleepDto.goalHours,
        averageHours: updateSleepDto.averageHours,
        bedtimeRoutine: updateSleepDto.bedtimeRoutine,
        alarmTime: updateSleepDto.alarmTime
          ? new Date(updateSleepDto.alarmTime)
          : null,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.sleepGoal.delete({
      where: { id: id },
    });
  }
}
