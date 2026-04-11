import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database…");

  // ─── Forum categories ───────────────────────────────────────────────────────
  const categories = [
    {
      name: "Annonces",
      slug: "annonces",
      description: "Informations officielles du club",
      icon: "📢",
      color: "#7C3AED",
      order: 0,
    },
    {
      name: "Vie de l'asso",
      slug: "vie-asso",
      description: "Actualités, événements, compte-rendus",
      icon: "🏐",
      color: "#059669",
      order: 1,
    },
    {
      name: "Événements",
      slug: "evenements",
      description: "Tournois, sorties, afterworks",
      icon: "🎉",
      color: "#D97706",
      order: 2,
    },
    {
      name: "Entraide",
      slug: "entraide",
      description: "Questions, conseils, covoiturage",
      icon: "🤝",
      color: "#2563EB",
      order: 3,
    },
    {
      name: "Off-topic",
      slug: "off-topic",
      description: "Discussions libres entre adhérents",
      icon: "💬",
      color: "#64748B",
      order: 4,
    },
  ];

  for (const cat of categories) {
    await db.forumCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`✓ ${categories.length} catégories forum créées`);

  // ─── Équipes (matchs / entraînements / convocations) ───────────────────────
  const teams = [
    { slug: "seniors-h", name: "Seniors hommes", category: "Seniors" },
    { slug: "seniors-f", name: "Seniors femmes", category: "Seniors" },
    { slug: "u18", name: "U18 mixte", category: "Jeunes" },
    { slug: "loisirs", name: "Loisirs", category: "Loisir" },
  ];
  for (const t of teams) {
    await db.team.upsert({
      where: { slug: t.slug },
      update: { name: t.name, category: t.category },
      create: t,
    });
  }
  console.log(`✓ ${teams.length} équipes créées ou mises à jour`);

  // ─── Admin user ─────────────────────────────────────────────────────────────
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "Admin!Lacanau2025";
  const passwordHash = await hash(adminPassword, 12);

  const admin = await db.user.upsert({
    where: { email: "admin@lacanau-volley.fr" },
    update: {},
    create: {
      email: "admin@lacanau-volley.fr",
      username: "admin",
      passwordHash,
      firstName: "Admin",
      lastName: "Lacanau",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
  console.log(`✓ Admin créé : ${admin.email} / username: admin`);
  console.log(`  Mot de passe: ${adminPassword}`);
  console.log("  ⚠️  Changez ce mot de passe immédiatement en production !");

  console.log("✅ Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
