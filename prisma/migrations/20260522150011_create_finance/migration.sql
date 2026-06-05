-- finance_categories + transactions

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Categories (seed fixo)
CREATE TABLE "finance_categories" (
  "id" SMALLSERIAL NOT NULL,
  "name" VARCHAR(50) NOT NULL,
  "icon" VARCHAR(10) NOT NULL,
  "type" VARCHAR(10) NOT NULL,

  CONSTRAINT "finance_categories_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "finance_categories_name_key" UNIQUE ("name"),
  CONSTRAINT "finance_categories_type_check" CHECK ("type" IN ('income', 'expense'))
);

-- Transactions
CREATE TABLE "transactions" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid()::text),
  "user_id" TEXT NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "amount" NUMERIC(12,2) NOT NULL,
  "type" VARCHAR(10) NOT NULL,
  "category_id" SMALLINT NOT NULL,
  "transaction_date" DATE NOT NULL DEFAULT CURRENT_DATE,
  "notes" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "transactions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "finance_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "transactions_amount_check" CHECK ("amount" > 0),
  CONSTRAINT "transactions_type_check" CHECK ("type" IN ('income', 'expense'))
);

CREATE INDEX "idx_transactions_user_date" ON "transactions"("user_id", "transaction_date" DESC);
CREATE INDEX "idx_transactions_user_type" ON "transactions"("user_id", "type");

-- Trigger updated_at
CREATE OR REPLACE FUNCTION "set_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "trg_transactions_updated_at" ON "transactions";
CREATE TRIGGER "trg_transactions_updated_at"
  BEFORE UPDATE ON "transactions"
  FOR EACH ROW EXECUTE FUNCTION "set_updated_at"();

