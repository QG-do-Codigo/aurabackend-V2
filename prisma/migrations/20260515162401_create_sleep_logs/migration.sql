-- sleep_logs
-- 1 registro por noite (user_id + log_date)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "sleep_logs" (
  "id" TEXT NOT NULL DEFAULT (gen_random_uuid()::text),
  "user_id" TEXT NOT NULL,
  "log_date" DATE NOT NULL,
  "bedtime" TIME NOT NULL,
  "wake_time" TIME NOT NULL,
  "duration_h" NUMERIC(4,2) GENERATED ALWAYS AS (
    CASE
      WHEN "wake_time" >= "bedtime"
        THEN EXTRACT(EPOCH FROM ("wake_time" - "bedtime")) / 3600
      ELSE EXTRACT(EPOCH FROM ("wake_time" + INTERVAL '24h' - "bedtime")) / 3600
    END
  ) STORED,
  "quality" SMALLINT NOT NULL,
  "factors" TEXT[] NOT NULL DEFAULT '{}'::text[],
  "notes" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT "sleep_logs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "sleep_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "sleep_logs_quality_check" CHECK ("quality" BETWEEN 1 AND 5),
  CONSTRAINT "sleep_logs_user_id_log_date_key" UNIQUE ("user_id", "log_date")
);

CREATE INDEX "idx_sleep_logs_user_date" ON "sleep_logs"("user_id", "log_date" DESC);

