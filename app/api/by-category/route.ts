// app/api/expenses/by-category/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(), // important!
    });

    if (!session?.user) {
      return NextResponse.json([], { status: 200 });
    }

    const userId = session.user.id;

    // Fetch all expenses for this user
    const expenses = await prisma.expense.findMany({
      where: { userId },
      select: { amount: true, categoryId: true },
    });

    // Aggregate by category
    const categoryMap: Record<string, number> = {};
    for (const exp of expenses) {
      if (!categoryMap[exp.categoryId]) categoryMap[exp.categoryId] = 0;
      categoryMap[exp.categoryId] += exp.amount;
    }

    // Fetch category names
    const categories = await prisma.category.findMany({
      where: { id: { in: Object.keys(categoryMap) } },
      select: { id: true, name: true },
    });

    const data = categories.map((cat) => ({
      category: cat.name,
      amount: categoryMap[cat.id],
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch category expenses", err);
    return NextResponse.json(
      { error: "Failed to fetch category expenses" },
      { status: 500 },
    );
  }
}
