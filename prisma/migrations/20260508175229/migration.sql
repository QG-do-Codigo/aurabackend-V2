/*
  Warnings:

  - You are about to alter the column `goal_hours` on the `sleep_goals` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `average_hours` on the `sleep_goals` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - Added the required column `category_id` to the `shopping_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HealthType" AS ENUM ('MEDICINE', 'WORKOUT');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('COMPRAS', 'AFAZERES', 'ESTUDOS', 'TRABALHO', 'FINANCAS', 'SAUDE', 'LAZER');

-- AlterTable
ALTER TABLE "health_reminders" ADD COLUMN     "type" "HealthType" NOT NULL DEFAULT 'MEDICINE';

-- AlterTable
ALTER TABLE "shopping_items" ADD COLUMN     "category_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sleep_goals" ALTER COLUMN "goal_hours" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "average_hours" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL;

-- CreateTable
CREATE TABLE "categories_shopping" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_shopping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_logs" (
    "id" TEXT NOT NULL,
    "reminder_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "health_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_shopping_name_key" ON "categories_shopping"("name");

-- CreateIndex
CREATE INDEX "health_logs_user_id_date_idx" ON "health_logs"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "health_logs_reminder_id_date_key" ON "health_logs"("reminder_id", "date");

-- AddForeignKey
ALTER TABLE "shopping_items" ADD CONSTRAINT "shopping_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories_shopping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_logs" ADD CONSTRAINT "health_logs_reminder_id_fkey" FOREIGN KEY ("reminder_id") REFERENCES "health_reminders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_logs" ADD CONSTRAINT "health_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
