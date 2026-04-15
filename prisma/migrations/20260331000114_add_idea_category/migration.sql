/*
  Warnings:

  - You are about to drop the column `type` on the `health_reminders` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ideas` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `shopping_items` table. All the data in the column will be lost.
  - You are about to alter the column `goal_hours` on the `sleep_goals` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `average_hours` on the `sleep_goals` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - The `category` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `categories_shopping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `health_logs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category_id` to the `ideas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "health_logs" DROP CONSTRAINT "health_logs_reminder_id_fkey";

-- DropForeignKey
ALTER TABLE "health_logs" DROP CONSTRAINT "health_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_items" DROP CONSTRAINT "shopping_items_category_id_fkey";

-- AlterTable
ALTER TABLE "health_reminders" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "ideas" DROP COLUMN "type",
ADD COLUMN     "category_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shopping_items" DROP COLUMN "category_id";

-- AlterTable
ALTER TABLE "sleep_goals" ALTER COLUMN "goal_hours" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "average_hours" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "category",
ADD COLUMN     "category" TEXT;

-- DropTable
DROP TABLE "categories_shopping";

-- DropTable
DROP TABLE "health_logs";

-- DropEnum
DROP TYPE "Category";

-- DropEnum
DROP TYPE "HealthType";

-- CreateTable
CREATE TABLE "idea_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "idea_categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "idea_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
