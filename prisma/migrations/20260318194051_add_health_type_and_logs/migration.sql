-- CreateEnum
CREATE TYPE "HealthType" AS ENUM ('MEDICINE', 'WORKOUT');

-- AlterTable
ALTER TABLE "health_reminders" ADD COLUMN     "type" "HealthType" NOT NULL DEFAULT 'MEDICINE';

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
CREATE INDEX "health_logs_user_id_date_idx" ON "health_logs"("user_id", "date");

-- AddForeignKey
ALTER TABLE "health_logs" ADD CONSTRAINT "health_logs_reminder_id_fkey" FOREIGN KEY ("reminder_id") REFERENCES "health_reminders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_logs" ADD CONSTRAINT "health_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
