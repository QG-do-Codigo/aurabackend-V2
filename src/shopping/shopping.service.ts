import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateShoppingDto } from "./dto/create-shopping.dto";
import { UpdateShoppingDto } from "./dto/update-shopping.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ShoppingService {
  constructor(private prisma: PrismaService) {}

  private readonly defaultCategoryNames = [
    "hortifruti",
    "laticinios",
    "mercearia",
    "limpeza",
    "uncategorized",
  ] as const;

  private ensuredDefaults: Promise<void> | null = null;

  private async ensureDefaultCategories() {
    if (!this.ensuredDefaults) {
      this.ensuredDefaults = (async () => {
        const count = await this.prisma.categoryShopping.count();
        if (count > 0) return;

        await this.prisma.categoryShopping.createMany({
          data: this.defaultCategoryNames.map((name) => ({ name })),
          skipDuplicates: true,
        });
      })().catch((err) => {
        this.ensuredDefaults = null;
        throw err;
      });
    }

    await this.ensuredDefaults;
  }

  private normalizeCategoryName(name: string) {
    return name.trim().toLowerCase();
  }

  private async resolveCategoryId(categoryId?: string, categoryName?: string) {
    await this.ensureDefaultCategories();

    if (categoryId) {
      const byId = await this.prisma.categoryShopping.findUnique({
        where: { id: categoryId },
        select: { id: true },
      });

      if (byId) return byId.id;

      const byName = await this.prisma.categoryShopping.findFirst({
        where: {
          name: { equals: this.normalizeCategoryName(categoryId), mode: "insensitive" },
        },
        select: { id: true },
      });

      if (byName) return byName.id;

      throw new BadRequestException(
        "categoryId inválido: categoria não encontrada (use /shopping/categories para listar)"
      );
    }

    if (categoryName) {
      const normalizedName = this.normalizeCategoryName(categoryName);
      const byName = await this.prisma.categoryShopping.findFirst({
        where: { name: { equals: normalizedName, mode: "insensitive" } },
        select: { id: true },
      });

      if (byName) return byName.id;

      const createdOrExisting = await this.prisma.categoryShopping.upsert({
        where: { name: normalizedName },
        update: {},
        create: { name: normalizedName },
        select: { id: true },
      });

      return createdOrExisting.id;
    }

    throw new BadRequestException("categoryId ou category é obrigatório");
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

  async findAllCategories() {
    await this.ensureDefaultCategories();
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
