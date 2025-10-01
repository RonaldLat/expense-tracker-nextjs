import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// Helper to format date as YYYY-MM
function getMonthKey(date: Date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(), // important: await headers()
    });

    if (!session?.user) {
      return NextResponse.json([], { status: 200 });
    }

    const userId = session.user.id;

    // Fetch all user expenses
    const expenses = await prisma.expense.findMany({
      where: { userId },
      select: { amount: true, date: true },
    });

    // Aggregate by month
    const monthlyMap: Record<string, number> = {};
    expenses.forEach((exp) => {
      const month = getMonthKey(exp.date);
      if (!monthlyMap[month]) monthlyMap[month] = 0;
      monthlyMap[month] += exp.amount;
    });

    // Convert to array for chart
    const data = Object.entries(monthlyMap)
      .sort(([a], [b]) => (a > b ? 1 : -1)) // sort by month
      .map(([month, total]) => ({ month, desktop: total })); // 'desktop' keeps same key as your chart

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Expense monthly fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly expenses" },
      { status: 500 },
    );
  }
}
