import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const categories = await db.forumCategory.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true, icon: true },
  });

  return NextResponse.json(categories);
}
