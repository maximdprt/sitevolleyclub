import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validators/auth";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Email invalide." }, { status: 422 });
    }

    const { email } = parsed.data;

    // On répond toujours 200 pour ne pas révéler si l'email existe (sécurité)
    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });

    if (user && user.status === "ACTIVE") {
      // Invalider les anciens tokens
      await db.passwordReset.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() },
      });

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

      await db.passwordReset.create({
        data: { userId: user.id, token, expiresAt },
      });

      const resetUrl = `${process.env.AUTH_URL}/reset-password?token=${token}`;
      await sendPasswordResetEmail(user.email, resetUrl);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[FORGOT_PASSWORD]", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
