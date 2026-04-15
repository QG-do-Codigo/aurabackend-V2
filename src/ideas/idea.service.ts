import { Injectable } from "@nestjs/common";
import { CreateIdeaDto } from "./dto/create-idea.dto";
import { UpdateIdeaDto } from "./dto/update-idea.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class IdeaService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateIdeaDto, userId: string) {
    return this.prisma.idea.create({
      data: {
        title: data.title,
        content: data.content,

        user: {
          connect: {
            id: userId,
          },
        },

        category: {
          connect: {
            id: data.categoryId,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.idea.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        category: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.idea.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateIdeaDto: UpdateIdeaDto) {
    return this.prisma.idea.update({
      where: {
        id,
      },
      data: {
        title: updateIdeaDto.title,
        content: updateIdeaDto.content,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.idea.delete({
      where: {
        id,
      },
    });
  }
}
