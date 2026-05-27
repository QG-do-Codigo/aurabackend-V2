/*
  Warnings:

  - Made the column `duration_h` on table `sleep_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "finance_categories" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "icon" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "sleep_logs" ALTER COLUMN "id" SET DEFAULT (gen_random_uuid()::TEXT),
ALTER COLUMN "duration_h" SET NOT NULL,
ALTER COLUMN "quality" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "id" SET DEFAULT (gen_random_uuid()::TEXT),
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "transaction_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- RenameIndex
ALTER INDEX "idx_sleep_logs_user_date" RENAME TO "sleep_logs_user_id_log_date_idx";

-- RenameIndex
ALTER INDEX "idx_transactions_user_date" RENAME TO "transactions_user_id_transaction_date_idx";

-- RenameIndex
ALTER INDEX "idx_transactions_user_type" RENAME TO "transactions_user_id_type_idx";
