import NextAuth from "next-auth";
import { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validators/auth";

const authSecret =
  process.env.AUTH_SECRET ??
  (process.env.NODE_ENV === "development"
    ? "dev-only-auth-secret-change-me-min-32-characters!!"
    : undefined);

if (process.env.NODE_ENV === "development" && !process.env.AUTH_SECRET) {
  console.warn(
    "[auth] AUTH_SECRET manquant — utilisation d'un secret de développement. " +
      "Créez .env.local avec AUTH_SECRET (openssl rand -base64 32).",
  );
}

class AccountStatusError extends CredentialsSignin {
  code: "PENDING" | "SUSPENDED";

  constructor(status: "PENDING" | "SUSPENDED") {
    super();
    this.code = status;
  }
}

// Credentials + JWT strategy n'a pas besoin d'un adapter base de données.
// L'adapter (PrismaAdapter) n'est utile que pour OAuth et magic links.
export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: authSecret,
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Identifiants",
      credentials: {
        login: { label: "Email ou nom d'utilisateur", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        // Validation Zod des entrées
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { login, password } = parsed.data;

        // Recherche par email OU username
        const user = await db.user.findFirst({
          where: {
            OR: [{ email: login.toLowerCase() }, { username: login }],
          },
        });

        if (!user) return null;

        // Vérification du statut
        if (user.status !== "ACTIVE") {
          throw new AccountStatusError(user.status === "PENDING" ? "PENDING" : "SUSPENDED");
        }

        // Vérification du mot de passe
        const isValid = await compare(password, user.passwordHash);
        if (!isValid) return null;

        // Mise à jour du dernier login
        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          username: user.username,
          role: user.role,
          status: user.status,
          image: user.avatarUrl,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 jours
    updateAge: 24 * 60 * 60,   // Refresh sliding toutes les 24h
  },

  callbacks: {
    async jwt({ token, user, trigger, session: updatedSession }) {
      // Données initiales au login
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.status = user.status;
      }

      // Refresh du session via update()
      if (trigger === "update" && updatedSession) {
        return { ...token, ...updatedSession };
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.status = token.status;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
});
