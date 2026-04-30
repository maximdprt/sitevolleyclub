import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validators/auth";
import { sendWelcomeEmail } from "@/lib/email";
import { createAuditLog } from "@/lib/audit";
import { getDatabaseUrlConfigError } from "@/lib/database-env";

function registerDbErrorMessage(error: unknown): string {
  const base =
    "Impossible d’écrire dans la base. Vérifiez DATABASE_URL / DIRECT_URL (URI PostgreSQL Supabase) et que les migrations Prisma sont appliquées.";

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P1001") {
      return "PostgreSQL injoignable : DATABASE_URL incorrecte, base arrêtée, ou pare-feu. Dans Supabase : Project Settings → Database → copier l’URI (mot de passe de la base), collez-la dans .env puis redémarrez le serveur.";
    }
    if (error.code === "P1000") {
      return "Authentification PostgreSQL refusée : vérifiez le mot de passe dans DATABASE_URL (caractères spéciaux encodés en URL).";
    }
    if (error.code === "P2021" || error.code === "P1014") {
      return "Table ou schéma Prisma manquant sur cette base : lancez `npx prisma migrate deploy` ou `npx prisma db push` sur le même projet que DATABASE_URL.";
    }
    if (error.code === "P2002") {
      return "Cet email ou ce nom d’utilisateur est déjà utilisé.";
    }
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    (error instanceof Error && /Can't reach database|connection/i.test(error.message))
  ) {
    return "Connexion à la base impossible. Vérifiez DATABASE_URL dans .env / .env.local et que le projet Supabase est actif.";
  }

  if (error instanceof Error && /must start with the protocol|validating datasource/i.test(error.message)) {
    return "DATABASE_URL ou DIRECT_URL n’est pas une URI PostgreSQL valide : les deux doivent commencer par postgresql:// (copie depuis Supabase → Database → Connection string, mode URI). Redémarrez `npm run dev` après modification du .env.";
  }

  if (process.env.NODE_ENV === "development" && error instanceof Error) {
    return `${base} (détail dev : ${error.message})`;
  }

  return base;
}

export async function POST(req: Request) {
  try {
    const dbConfigError = getDatabaseUrlConfigError();
    if (dbConfigError) {
      return NextResponse.json({ error: dbConfigError }, { status: 500 });
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
    const message = registerDbErrorMessage(error);
    const status = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002" ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
