import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyEmailSchema } from "@/lib/validators/auth";
import { sendWelcomeEmail } from "@/lib/email";
import { createAuditLog } from "@/lib/audit";

/**
 * POST /api/auth/verify-email
 * Body: { token: string }
 *
 * Vérifie un token d’email :
 *   • marque le token comme `verifiedAt`
 *   • l’utilisateur reste en statut PENDING (validation admin requise)
 *   • envoie l’email « email confirmé + en attente de validation »
 *
 * Idempotent : si le token est déjà utilisé, renvoie `alreadyVerified: true`.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = verifyEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Token invalide." }, { status: 422 });
    }

    const { token } = parsed.data;

    const record = await db.emailVerification.findUnique({
      where: { token },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, status: true },
        },
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Lien de vérification invalide." },
        { status: 400 },
      );
    }

    if (record.verifiedAt) {
      return NextResponse.json(
        { success: true, alreadyVerified: true, email: record.user.email },
        { status: 200 },
      );
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        {
          error: "Lien de vérification expiré. Demandez un nouvel email de vérification.",
        },
        { status: 400 },
      );
    }

    await db.emailVerification.update({
      where: { id: record.id },
      data: { verifiedAt: new Date() },
    });

    // Notification : email confirmé → compte en attente de validation admin
    sendWelcomeEmail(record.user.email, record.user.firstName).catch(
      console.error,
    );

    createAuditLog({
      userId: record.userId,
      action: "EMAIL_VERIFIED",
      resource: "user",
      metadata: { email: record.user.email },
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      email: record.user.email,
    });
  } catch (error) {
    console.error("[VERIFY_EMAIL]", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
