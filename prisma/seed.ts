import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

const defaultShoppingCategories = [
  "hortifruti",
  "laticinios",
  "mercearia",
  "limpeza",
  "uncategorized",
];

async function main() {
  await prisma.categoryShopping.createMany({
    data: defaultShoppingCategories.map((name) => ({ name })),
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
