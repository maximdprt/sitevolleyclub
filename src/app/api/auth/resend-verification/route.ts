import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { resendVerificationSchema } from "@/lib/validators/auth";
import { sendVerificationEmail } from "@/lib/email";

function getAppUrl(req: Request): string {
  return (
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    new URL(req.url).origin
  );
}

/**
 * POST /api/auth/resend-verification
 * Body: { email: string }
 *
 * Renvoie un nouveau lien de vérification.
 * Pour ne pas révéler l’existence d’un email, on répond toujours 200.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resendVerificationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Email invalide." }, { status: 422 });
    }

    const email = parsed.data.email.toLowerCase();
    const user = await db.user.findUnique({ where: { email } });

    if (user) {
      // Cherche un token déjà utilisé pour savoir si l’email est déjà vérifié
      const verified = await db.emailVerification.findFirst({
        where: { userId: user.id, verifiedAt: { not: null } },
      });

      if (!verified) {
        // Invalider les anciens tokens non utilisés
        await db.emailVerification.deleteMany({
          where: { userId: user.id, verifiedAt: null },
        });

        const token = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await db.emailVerification.create({
          data: { userId: user.id, token, expiresAt },
        });

        const verifyUrl = `${getAppUrl(req)}/verify-email?token=${token}`;
        await sendVerificationEmail(user.email, user.firstName, verifyUrl);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RESEND_VERIFICATION]", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
