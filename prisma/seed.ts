// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const userId = "A5LchYocwPNTMW9GCkNyGTRn5B1NynpS";

  // Seed categories
  const categories = [
    "Food",
    "Transport",
    "Bills",
    "Entertainment",
    "Health",
    "Other",
  ];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name_userId: { name, userId } },
      update: {},
      create: { name, userId },
    });
  }

  const allCategories = await prisma.category.findMany({ where: { userId } });

  // Seed random expenses for past 3 months
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);

  const expenses = [];
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const randomCategory =
      allCategories[Math.floor(Math.random() * allCategories.length)];
    const randomAmount = Math.floor(Math.random() * 5000) + 100;

    expenses.push({
      title: `${randomCategory.name} expense`, // ✅ add title
      amount: randomAmount,
      categoryId: randomCategory.id,
      userId,
      date: new Date(d),
    });
  }

  await prisma.expense.createMany({ data: expenses });

  console.log("Seed completed with title field!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
