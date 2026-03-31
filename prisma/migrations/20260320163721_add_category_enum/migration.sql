/*
  Warnings:

  - Added the required column `category` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('COMPRAS', 'AFAZERES', 'ESTUDOS', 'TRABALHO', 'FINANCAS', 'SAUDE', 'LAZER');

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL;
