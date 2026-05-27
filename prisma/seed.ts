import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
  log: ["error", "warn"],
});

const defaultShoppingCategories = [
  "hortifruti",
  "laticinios",
  "mercearia",
  "limpeza",
  "uncategorized",
];

const financeCategories = [
  { id: 1, name: "Renda", icon: "💰", type: "income" },
  { id: 2, name: "Extra", icon: "💼", type: "income" },
  { id: 10, name: "Moradia", icon: "🏠", type: "expense" },
  { id: 11, name: "Alimentação", icon: "🛒", type: "expense" },
  { id: 12, name: "Saúde", icon: "💪", type: "expense" },
  { id: 13, name: "Mobilidade", icon: "🚗", type: "expense" },
  { id: 14, name: "Lazer", icon: "🎮", type: "expense" },
  { id: 15, name: "Educação", icon: "📚", type: "expense" },
  { id: 16, name: "Vestuário", icon: "👕", type: "expense" },
  { id: 17, name: "Outros", icon: "📦", type: "expense" },
];

async function seedFinanceCategories() {
  for (const category of financeCategories) {
    const existing = await prisma.financeCategory.findUnique({
      where: { name: category.name },
      select: { id: true },
    });

    if (existing && existing.id !== category.id) {
      console.warn(
        `[seed] finance category id mismatch for \"${category.name}\": db=${existing.id} seed=${category.id}. ` +
          "Reset the database to apply deterministic ids."
      );
      continue;
    }

    await prisma.financeCategory.upsert({
      where: { name: category.name },
      update: { icon: category.icon, type: category.type },
      create: category,
    });
  }

  await prisma.$executeRawUnsafe(
    "SELECT setval(pg_get_serial_sequence('finance_categories', 'id'), (SELECT COALESCE(MAX(id), 1) FROM finance_categories), true);"
  );
}

async function main() {
  await prisma.categoryShopping.createMany({
    data: defaultShoppingCategories.map((name) => ({ name })),
    skipDuplicates: true,
  });

  await seedFinanceCategories();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
