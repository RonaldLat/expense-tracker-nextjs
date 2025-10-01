import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(), // await headers before passing
    });

    if (!session?.user) {
      return NextResponse.json([], { status: 200 });
    }

    const userId = session.user.id;

    // Aggregate total expenses per category
    const expenses = await prisma.expense.groupBy({
      by: ["categoryId"],
      _sum: { amount: true },
      where: { userId },
    });

    // Fetch category names
    const categoryIds = expenses.map((e) => e.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });

    // Map to API format: [{ category: "Food", total: 123 }, ...]
    const data = expenses.map((e) => {
      const category = categories.find((c) => c.id === e.categoryId);
      return {
        category: category?.name ?? "Unknown",
        total: e._sum.amount ?? 0,
      };
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Expense category fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 },
    );
  }
}
