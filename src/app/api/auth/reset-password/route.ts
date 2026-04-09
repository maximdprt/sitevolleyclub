import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { resetPasswordSchema } from "@/lib/validators/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides." }, { status: 422 });
    }

    const { token, password } = parsed.data;

    const resetRecord = await db.passwordReset.findUnique({
      where: { token },
      include: { user: { select: { id: true, status: true } } },
    });

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Token invalide ou expiré." },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password, 12);

    await db.$transaction([
      db.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      db.passwordReset.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
    ]);

    createAuditLog({
      userId: resetRecord.userId,
      action: "PASSWORD_RESET",
      resource: "user",
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RESET_PASSWORD]", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
