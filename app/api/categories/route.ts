import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch categories (shared + user-specific)
export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { userId: null }, // shared categories
          { userId: session.user.id }, // user’s categories
        ],
      },
      orderBy: { name: "asc" },
    });

    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.error("Category fetch error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch categories" }),
      { status: 500 },
    );
  }
}

// POST: Create a new category
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return new Response(
        JSON.stringify({ error: "Category name is required" }),
        { status: 400 },
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        userId: session.user.id, // tie to the logged-in user
      },
    });

    return new Response(JSON.stringify(category), { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      // Prisma duplicate unique constraint error
      return new Response(
        JSON.stringify({ error: "Category already exists" }),
        { status: 400 },
      );
    }

    console.error("Category create error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create category" }),
      { status: 500 },
    );
  }
}
