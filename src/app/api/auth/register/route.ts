import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validators/auth";
import { sendWelcomeEmail } from "@/lib/email";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          error:
            "Configuration serveur incomplète: DATABASE_URL est manquante. Vérifiez votre fichier .env.local.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    // Validation Zod stricte
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides.", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { email, username, firstName, lastName, password } = parsed.data;

    // Unicité email + username
    const existing = await db.user.findFirst({
      where: { OR: [{ email: email.toLowerCase() }, { username }] },
      select: { email: true, username: true },
    });

    if (existing) {
      const field = existing.email === email.toLowerCase() ? "email" : "username";
      return NextResponse.json(
        { error: `Cet ${field === "email" ? "email" : "nom d'utilisateur"} est déjà utilisé.` },
        { status: 409 }
      );
    }

    // Hash bcrypt (12 rounds)
    const passwordHash = await hash(password, 12);

    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        username,
        firstName,
        lastName,
        passwordHash,
        role: "ADHERENT",
        status: "PENDING",
      },
    });

    // Audit log (sans await pour ne pas bloquer la réponse)
    createAuditLog({
      userId: user.id,
      action: "REGISTER",
      resource: "user",
      metadata: { email: user.email, username: user.username },
    }).catch(console.error);

    // Email de bienvenue (sans await pour ne pas bloquer)
    sendWelcomeEmail(user.email, user.firstName).catch(console.error);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[REGISTER]", error);
    return NextResponse.json(
      {
        error:
          "Erreur serveur pendant l'inscription. Vérifiez DATABASE_URL et la connexion PostgreSQL.",
      },
      { status: 500 }
    );
  }
}
