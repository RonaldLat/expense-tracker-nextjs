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
    const rawCategoryIds = expenses.map((e) => e.categoryId);
    
    // FIX: Filter out null values before querying the database
    const categoryIds = rawCategoryIds.filter((id): id is string => id !== null);

    // If there are no non-null category IDs, return an empty array or handle as needed
    if (categoryIds.length === 0) {
      // If all expenses are uncategorized, 'expenses' array still holds the totals
      // but we can't find categories for them. We should handle the mapping below.
    }
    
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } }, // Now categoryIds is a string[]
    });

    // Map to API format: [{ category: "Food", total: 123 }, ...]
    const data = expenses.map((e) => {
      // Handle the case where categoryId is null
      if (e.categoryId === null) {
          return {
              category: "Uncategorized",
              total: e._sum.amount ?? 0,
          };
      }
      
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
