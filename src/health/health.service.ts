import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { CreateHealthDto } from "./dto/create-health.dto";
import { UpdateHealthDto } from "./dto/update-health.dto";
import { PrismaService } from "src/prisma/prisma.service";
import {
  startOfDay,
  isSameDay,
  getWeekDays,
  differenceInCalendarDays,
} from "./health.utils";

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHealthDto: CreateHealthDto, userId: string) {
    try {
      return await this.prisma.healthReminder.create({
        data: {
          title: createHealthDto.title,
          description: createHealthDto.description,
          time: createHealthDto.time,
          type: createHealthDto.type,
          repeatDaily: createHealthDto.repeatDaily,
          userId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to create health reminder",
      );
    }
  }

  async findAll(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.healthReminder.findMany({
      where: { userId },
      include: {
        logs: {
          where: { userId, date: today },
          orderBy: { date: "desc" },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminder = await this.prisma.healthReminder.findFirst({
      where: { id, userId },
      include: {
        logs: {
          where: { userId, date: today },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!reminder) {
      throw new NotFoundException(
        `Health reminder with ID ${id} not found`,
      );
    }

    return reminder;
  }

  async update(
    id: string,
    userId: string,
    updateHealthDto: UpdateHealthDto,
  ) {
    await this.ensureExists(id, userId);

    try {
      const { type, ...rest } = updateHealthDto as any; 

      return await this.prisma.healthReminder.update({
        where: { id },
        data: rest,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to update health reminder",
      );
    }
  }

  async markAsDone(reminderId: string, userId: string) {
    return this.confirm(reminderId, userId, new Date());
  }

  async remove(id: string, userId: string) {
    await this.ensureExists(id, userId);

    await this.prisma.healthLog.deleteMany({
      where: { reminderId: id },
    });

    return this.prisma.healthReminder.delete({
      where: { id },
    });
  }

  async confirm(reminderId: string, userId: string, date: Date) {
    const normalizedDate = startOfDay(date);
    const today = startOfDay(new Date());

    if (normalizedDate.getTime() > today.getTime()) {
      throw new BadRequestException("Cannot confirm future dates");
    }

    const daysDiff = differenceInCalendarDays(today, normalizedDate);
    if (daysDiff > 3) {
      throw new BadRequestException(
        "Confirmation allowed only for the last 3 days",
      );
    }

    await this.ensureExists(reminderId, userId);

    const existing = await this.prisma.healthLog.findFirst({
      where: {
        reminderId,
        userId,
        date: normalizedDate,
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.healthLog.create({
      data: {
        reminderId,
        userId,
        date: normalizedDate,
        completed: true,
        completedAt: new Date(),
      },
    });
  }

  async getWeek(userId: string) {
    const weekDays = getWeekDays(new Date());
    const weekStart = weekDays[0];
    const weekEnd = weekDays[6];
    const weekEndOfDay = new Date(weekEnd);
    weekEndOfDay.setHours(23, 59, 59, 999);
    const today = startOfDay(new Date());

    const reminders = await this.prisma.healthReminder.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    const logs = await this.prisma.healthLog.findMany({
      where: {
        userId,
        date: {
          gte: weekStart,
          lte: weekEndOfDay,
        },
      },
    });

    const logMap = new Map<string, Map<number, typeof logs[number]>>();
    for (const log of logs) {
      const reminderMap =
        logMap.get(log.reminderId) ??
        (() => {
          const created = new Map<number, typeof logs[number]>();
          logMap.set(log.reminderId, created);
          return created;
        })();
      const key = startOfDay(log.date).getTime();
      reminderMap.set(key, log);
    }

    return reminders.map((reminder) => {
      const reminderLogs = logMap.get(reminder.id);

      const days = weekDays.map((day) => {
        const key = day.getTime();
        const log = reminderLogs?.get(key);

        let status: "pending" | "done" | "late" | "missed";
        if (log) {
          status =
            log.completedAt && isSameDay(log.completedAt, day)
              ? "done"
              : "late";
        } else if (day.getTime() < today.getTime()) {
          status = "missed";
        } else {
          status = "pending";
        }

        return {
          date: day,
          status,
          logId: log?.id ?? null,
          completedAt: log?.completedAt ?? null,
        };
      });

      return {
        ...reminder,
        days,
      };
    });
  }

  private async ensureExists(id: string, userId: string) {
    const exists = await this.prisma.healthReminder.findFirst({
      where: { id, userId },
    });

    if (!exists) {
      throw new NotFoundException(
        `Health reminder with ID ${id} not found`,
      );
    }
  }
}
