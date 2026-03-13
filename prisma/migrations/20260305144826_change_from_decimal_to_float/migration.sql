/*
  Warnings:

  - You are about to alter the column `goal_hours` on the `sleep_goals` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `average_hours` on the `sleep_goals` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "sleep_goals" ALTER COLUMN "goal_hours" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "average_hours" SET DATA TYPE DOUBLE PRECISION;
