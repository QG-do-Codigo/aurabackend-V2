-- AlterTable
ALTER TABLE "categories_shopping" RENAME CONSTRAINT "categories_shopping_new_pkey" TO "categories_shopping_pkey";

-- RenameIndex
ALTER INDEX "categories_shopping_new_name_key" RENAME TO "categories_shopping_name_key";
