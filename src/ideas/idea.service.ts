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

  findAll() {
    return `This action returns all idea`;
  }

  findOne(id: number) {
    return `This action returns a #${id} idea`;
  }

  update(id: number, updateIdeaDto: UpdateIdeaDto) {
    return `This action updates a #${id} idea`;
  }

  remove(id: number) {
    return `This action removes a #${id} idea`;
  }
}
