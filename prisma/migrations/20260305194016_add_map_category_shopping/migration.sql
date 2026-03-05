/*
  Warnings:

  - You are about to drop the `Category_Shopping` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "shopping_items" DROP CONSTRAINT "shopping_items_category_id_fkey";

-- DropTable
DROP TABLE "Category_Shopping";

-- CreateTable
CREATE TABLE "categories_shopping" (
    "id" TEXT NOT NULL,
    "hortifruti" TEXT NOT NULL,
    "laticinios" TEXT NOT NULL,
    "mercearia" TEXT NOT NULL,
    "limpeza" TEXT NOT NULL,

    CONSTRAINT "categories_shopping_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shopping_items" ADD CONSTRAINT "shopping_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories_shopping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
