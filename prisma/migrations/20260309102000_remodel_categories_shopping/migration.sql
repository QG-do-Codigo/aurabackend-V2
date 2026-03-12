-- Remodel categories_shopping to a normalized table: (id, name)

ALTER TABLE "shopping_items" DROP CONSTRAINT "shopping_items_category_id_fkey";

CREATE TABLE "categories_shopping_new" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "categories_shopping_new_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "categories_shopping_new_name_key" ON "categories_shopping_new"("name");

-- Preserve existing category labels found in old columns
DO $$
BEGIN
  IF to_regclass('public."Category_Shopping"') IS NOT NULL THEN
    EXECUTE '
      INSERT INTO "categories_shopping_new" ("id", "name")
      SELECT md5(lower(trim(s."name"))), lower(trim(s."name"))
      FROM (
        SELECT "hortifruti" AS "name" FROM "Category_Shopping"
        UNION ALL
        SELECT "laticinios" AS "name" FROM "Category_Shopping"
        UNION ALL
        SELECT "mercearia" AS "name" FROM "Category_Shopping"
        UNION ALL
        SELECT "limpeza" AS "name" FROM "Category_Shopping"
      ) s
      WHERE s."name" IS NOT NULL
        AND trim(s."name") <> ''''
      ON CONFLICT ("name") DO NOTHING
    ';
  END IF;

  IF to_regclass('public."categories_shopping"') IS NOT NULL THEN
    EXECUTE '
      INSERT INTO "categories_shopping_new" ("id", "name")
      SELECT md5(lower(trim(s."name"))), lower(trim(s."name"))
      FROM (
        SELECT "hortifruti" AS "name" FROM "categories_shopping"
        UNION ALL
        SELECT "laticinios" AS "name" FROM "categories_shopping"
        UNION ALL
        SELECT "mercearia" AS "name" FROM "categories_shopping"
        UNION ALL
        SELECT "limpeza" AS "name" FROM "categories_shopping"
      ) s
      WHERE s."name" IS NOT NULL
        AND trim(s."name") <> ''''
      ON CONFLICT ("name") DO NOTHING
    ';
  END IF;
END $$;

-- Ensure baseline categories exist
INSERT INTO "categories_shopping_new" ("id", "name") VALUES
  (md5('hortifruti'), 'hortifruti'),
  (md5('laticinios'), 'laticinios'),
  (md5('mercearia'), 'mercearia'),
  (md5('limpeza'), 'limpeza'),
  (md5('uncategorized'), 'uncategorized')
ON CONFLICT ("name") DO NOTHING;

-- Old relation pointed to old row IDs; remap orphan IDs to uncategorized
UPDATE "shopping_items"
SET "category_id" = md5('uncategorized')
WHERE "category_id" NOT IN (SELECT "id" FROM "categories_shopping_new");

DROP TABLE IF EXISTS "categories_shopping";
DROP TABLE IF EXISTS "Category_Shopping";
ALTER TABLE "categories_shopping_new" RENAME TO "categories_shopping";

ALTER TABLE "shopping_items"
ADD CONSTRAINT "shopping_items_category_id_fkey"
FOREIGN KEY ("category_id") REFERENCES "categories_shopping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
