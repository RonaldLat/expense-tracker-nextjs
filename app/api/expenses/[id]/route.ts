import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PUT: Update expense
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 params is async
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = await context.params; // 👈 await here
  const { title, amount, categoryId, date, notes } = await req.json();

  const expense = await prisma.expense.update({
    where: { id },
    data: {
      title,
      amount,
      categoryId,
      date: date ? new Date(date) : undefined,
      notes,
    },
  });

  return new Response(JSON.stringify(expense), { status: 200 });
}

// DELETE: Remove expense
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 same fix
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { id } = await context.params; // 👈 must await

  await prisma.expense.delete({
    where: { id },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
