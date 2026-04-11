"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function respondConvocationAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non connecté");

  const convocationId = z.string().min(1).parse(formData.get("convocationId"));
  const attendance = z.enum(["YES", "NO", "MAYBE"]).parse(formData.get("attendance"));

  await db.convocationResponse.upsert({
    where: {
      convocationId_userId: { convocationId, userId: session.user.id },
    },
    update: { attendance },
    create: {
      convocationId,
      userId: session.user.id,
      attendance,
    },
  });

  revalidatePath("/espace-membre");
}
