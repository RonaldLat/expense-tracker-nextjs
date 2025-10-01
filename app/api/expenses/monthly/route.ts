import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all expenses, select only date and amount
    const expenses = await prisma.expense.findMany({
      orderBy: { date: "asc" },
      select: {
        amount: true,
        date: true,
      },
    });

    // Aggregate expenses by month (YYYY-MM)
    const monthlyMap: Record<string, number> = {};
    expenses.forEach((exp) => {
      const month = new Date(exp.date).toISOString().slice(0, 7); // e.g., "2024-09"
      monthlyMap[month] = (monthlyMap[month] || 0) + exp.amount;
    });

    // Convert aggregated map to array for chart
    const monthlyData = Object.entries(monthlyMap).map(([date, amount]) => ({
      date,
      amount,
    }));

    return NextResponse.json(monthlyData);
  } catch (err) {
    console.error("Expense monthly fetch error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
