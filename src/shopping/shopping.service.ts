import { Injectable } from "@nestjs/common";
import { CreateShoppingDto } from "./dto/create-shopping.dto";
import { UpdateShoppingDto } from "./dto/update-shopping.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ShoppingService {
  constructor(private prisma: PrismaService) {}

  create(createShoppingDto: CreateShoppingDto, userId: string) {
    try {
      if (!createShoppingDto) {
        throw new Error("createShoppingDto is undefined");
      }

      return this.prisma.shoppingItem.create({
        data: {
          name: createShoppingDto.name,
          quantity: createShoppingDto.quantity,
          purchased: createShoppingDto.purchased,
          userId: userId,
        },
      });
    } catch (error) {
      console.log("Error creating shopping item:", error);
      return { error: error.message };
    }
    return "This action adds a new shopping";
  }

  findAll(userId: string) {
    return this.prisma.shoppingItem.findMany({
      where: {
        userId: userId,
      },
    });
  }

  update(id: string, updateShoppingDto: UpdateShoppingDto) {
    return this.prisma.shoppingItem.update({
      where: { id },
      data: updateShoppingDto,
    });
  }

  remove(id: string) {
    return this.prisma.shoppingItem.delete({ where: { id } });
  }
}
