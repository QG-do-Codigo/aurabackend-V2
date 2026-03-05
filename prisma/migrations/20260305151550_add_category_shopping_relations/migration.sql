/*
  Warnings:

  - Added the required column `category_id` to the `shopping_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shopping_items" ADD COLUMN     "category_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "shopping_items" ADD CONSTRAINT "shopping_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category_Shopping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
