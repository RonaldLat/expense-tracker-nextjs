import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/expenses - list all expenses for the logged-in user
export async function GET(req: NextRequest) {
  try {
    // ✅ Correct way to get session in better-auth
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json([], { status: 200 });
    }

    const expenses = await prisma.expense.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Expense fetch error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST /api/expenses - create a new expense
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, amount, categoryId } = await req.json();

    if (!title || !amount) {
      return NextResponse.json(
        { error: "Title and amount are required" },
        { status: 400 },
      );
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        amount,
        categoryId: categoryId || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Expense create error:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 },
    );
  }
}
