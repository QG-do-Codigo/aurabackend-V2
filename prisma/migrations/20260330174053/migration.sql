/*
  Warnings:

  - A unique constraint covering the columns `[reminder_id,date]` on the table `health_logs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "health_logs_reminder_id_date_key" ON "health_logs"("reminder_id", "date");
