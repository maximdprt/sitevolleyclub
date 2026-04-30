/**
 * Vérifie que DATABASE_URL / DIRECT_URL sont présentes et au format attendu par Prisma (PostgreSQL).
 * Évite l'erreur opaque « the URL must start with the protocol ».
 */
const POSTGRES_PROTOCOL = /^postgres(ql)?:\/\//i;

export function getDatabaseUrlConfigError(): string | null {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const directUrl = process.env.DIRECT_URL?.trim() ?? databaseUrl;

  if (!databaseUrl) {
    return "DATABASE_URL est manquante ou vide. Créez un fichier .env.local à la racine du projet avec une ligne du type : DATABASE_URL=\"postgresql://...\" (URI complète depuis Supabase → Database → Connection string → URI).";
  }
  if (!POSTGRES_PROTOCOL.test(databaseUrl)) {
    return "DATABASE_URL doit commencer par postgresql:// ou postgres:// (pas seulement l’hôte ni une valeur entre guillemets vide). Copiez l’URI complète depuis Supabase (Project Settings → Database → Connection string, mode URI).";
  }

  if (!directUrl || !POSTGRES_PROTOCOL.test(directUrl)) {
    return "DIRECT_URL doit commencer par postgresql:// ou postgres:// (URI PostgreSQL complète, comme pour DATABASE_URL).";
  }

  return null;
}
