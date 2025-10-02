import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Group expenses by month and category
    const summary = await prisma.expense.groupBy({
      by: ["categoryId"],
      where: { userId },
      _sum: { amount: true },
      orderBy: { categoryId: "asc" },
    });

    // Populate category names
    const result = await Promise.all(
      summary.map(async (item) => {
        // FIX: Check for null categoryId before attempting to query the database
        if (item.categoryId === null) {
          return {
            category: "Uncategorized", // Treat null categoryId as "Uncategorized"
            total: item._sum.amount || 0,
          };
        }

        const category = await prisma.category.findUnique({
          where: { id: item.categoryId }, // Now TypeScript knows item.categoryId is a string
        });

        return {
          category: category?.name || "Unknown",
          total: item._sum.amount || 0,
        };
      }),
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Summary fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 },
    );
  }
}
