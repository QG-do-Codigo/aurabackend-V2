import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateShoppingDto } from "./dto/create-shopping.dto";
import { UpdateShoppingDto } from "./dto/update-shopping.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ShoppingService {
  constructor(private prisma: PrismaService) {}

  private async resolveCategoryId(categoryId?: string, categoryName?: string) {
    if (categoryId) {
      const byId = await this.prisma.categoryShopping.findUnique({
        where: { id: categoryId },
        select: { id: true },
      });

      if (!byId) {
        throw new BadRequestException("categoryId inválido: categoria não encontrada");
      }
      return byId.id;
    }

    if (categoryName) {
      const byName = await this.prisma.categoryShopping.findFirst({
        where: { name: { equals: categoryName, mode: "insensitive" } },
        select: { id: true },
      });

      if (!byName) {
        throw new BadRequestException("category inválida: categoria não encontrada");
      }
      return byName.id;
    }

    throw new BadRequestException("categoryId é obrigatório");
  }

  async create(createShoppingDto: CreateShoppingDto, userId: string) {
    if (!createShoppingDto) {
      throw new BadRequestException("Payload inválido");
    }

    const categoryId = await this.resolveCategoryId(
      createShoppingDto.categoryId,
      createShoppingDto.category
    );

    return this.prisma.shoppingItem.create({
      data: {
        name: createShoppingDto.name,
        quantity: createShoppingDto.quantity,
        purchased: createShoppingDto.purchased,
        categoryId: categoryId,
        userId: userId,
      },
    });
  }

  async findAll(userId: string, categoryId?: string, category?: string) {
    const resolvedCategoryId =
      categoryId || category
        ? await this.resolveCategoryId(categoryId, category)
        : undefined;

    return this.prisma.shoppingItem.findMany({
      where: {
        userId: userId,
        ...(resolvedCategoryId && { categoryId: resolvedCategoryId }),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  findAllCategories() {
    return this.prisma.categoryShopping.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async update(id: string, updateShoppingDto: UpdateShoppingDto) {
    const categoryId =
      updateShoppingDto.categoryId || updateShoppingDto.category
        ? await this.resolveCategoryId(
          updateShoppingDto.categoryId,
          updateShoppingDto.category
        )
        : undefined;

    const data = {
      ...(updateShoppingDto.name !== undefined && { name: updateShoppingDto.name }),
      ...(updateShoppingDto.quantity !== undefined && {
        quantity: updateShoppingDto.quantity,
      }),
      ...(updateShoppingDto.purchased !== undefined && {
        purchased: updateShoppingDto.purchased,
      }),
      ...(categoryId && { categoryId }),
    };

    return this.prisma.$transaction(async (tx) => {
      const updatedItem =
        Object.keys(data).length > 0
          ? await tx.shoppingItem.update({
              where: { id },
              data,
            })
          : await tx.shoppingItem.findUniqueOrThrow({
              where: { id },
            });

      const itemsToAdd = updateShoppingDto.items ?? [];

      if (itemsToAdd.length === 0) {
        return updatedItem;
      }

      const createdItems = await Promise.all(
        itemsToAdd.map((item) =>
          tx.shoppingItem.create({
            data: {
              name: item.name,
              quantity: item.quantity,
              purchased: false,
              userId: updatedItem.userId,
              categoryId: updatedItem.categoryId,
            },
          })
        )
      );

      return {
        updatedItem,
        addedItems: createdItems,
      };
    });
  }

  remove(id: string) {
    return this.prisma.shoppingItem.delete({ where: { id } });
  }
}
