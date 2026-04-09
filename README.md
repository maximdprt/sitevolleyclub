# Lacanau Volley-Ball — Espace Adhérent

Site public + espace adhérent sécurisé pour l'AS Lacanau Section Volley-Ball.

---

## Stack

| Couche | Tech |
|--------|------|
| Framework | Next.js 16+ (App Router, Server Components) |
| Langage | TypeScript strict |
| Styles | Tailwind CSS v4 + composants Radix UI |
| Auth | NextAuth.js v5 (Auth.js) — Credentials + JWT |
| BDD | PostgreSQL (Neon / Supabase) + Prisma 6 |
| Upload | UploadThing |
| Email | Resend |
| Rate limit | Upstash Redis |
| Animations | Framer Motion |

---

## Installation

```bash
# 1. Cloner & installer
npm install

# 2. Copier les variables d'environnement
cp .env.example .env.local
# → renseigner toutes les valeurs dans .env.local

# 3. Générer le client Prisma
npm run db:generate

# 4. Appliquer le schéma à la base de données
npm run db:migrate
# ou pour un push direct (sans migration)
npm run db:push

# 5. Seeder la base (catégories forum + admin par défaut)
npm run db:seed

# 6. Lancer le serveur de développement
npm run dev
```

---

## Variables d'environnement

Voir `.env.example` pour la liste complète documentée.

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `DATABASE_URL` | ✅ | URL PostgreSQL (Neon/Supabase) |
| `DIRECT_URL` | ✅ (Neon) | URL directe pour les migrations |
| `AUTH_SECRET` | ✅ | Secret JWT (`openssl rand -base64 32`) |
| `AUTH_URL` | ✅ | URL publique (ex: `https://monsite.com`) |
| `UPLOADTHING_SECRET` | ✅ | Clé UploadThing |
| `UPLOADTHING_APP_ID` | ✅ | App ID UploadThing |
| `RESEND_API_KEY` | ✅ | Clé API Resend |
| `UPSTASH_REDIS_REST_URL` | ⚡ | Upstash Redis (rate limiting) |
| `UPSTASH_REDIS_REST_TOKEN` | ⚡ | Token Upstash Redis |

> ⚡ Optionnel — le rate limiting est désactivé si non configuré.

---

## Commandes Prisma

```bash
npm run db:generate   # Génère le client Prisma
npm run db:migrate    # Migration dev (crée les fichiers de migration)
npm run db:push       # Push direct du schéma (sans migration)
npm run db:seed       # Seed : catégories forum + compte admin
npm run db:studio     # Ouvre Prisma Studio (GUI BDD)
```

---

## Compte admin par défaut (seed)

| Champ | Valeur |
|-------|--------|
| Email | `admin@lacanau-volley.fr` |
| Username | `admin` |
| Mot de passe | `Admin!Lacanau2025` (ou `ADMIN_SEED_PASSWORD` dans `.env`) |

> ⚠️ **Changez ce mot de passe immédiatement en production !**

---

## Routes protégées

| Route | Rôle minimum |
|-------|-------------|
| `/espace-adherent/*` | `ADHERENT` (statut `ACTIVE`) |
| `/forum/*` | `ADHERENT` (statut `ACTIVE`) |
| `/comite-direction/*` | `COMITE_DIRECTION` |
| `/admin/*` | `ADMIN` |

---

## Structure

```
/src
  /app
    /(auth)           ← Login, Register, Forgot password
    /(dashboard)      ← Espace adhérent, Forum, Comité
    /api              ← Routes API (auth, documents, forum, upload)
  /components
    /ui               ← Composants Radix/shadcn-style
    /layout           ← Sidebar, Header
    /forum            ← CommentForm
  /lib
    auth.ts           ← Config NextAuth
    db.ts             ← Prisma singleton
    rate-limit.ts     ← Upstash rate limiting
    upload.ts         ← UploadThing config
    email.ts          ← Resend helpers
    audit.ts          ← Logs d'audit
    utils.ts          ← Utilitaires
    /validators       ← Schémas Zod
    /i18n             ← Textes FR
  /types              ← Augmentation types NextAuth
  middleware.ts       ← Protection des routes par rôle
/prisma
  schema.prisma       ← Schéma complet
  seed.ts             ← Seed de démarrage
```

---

## Déploiement (Vercel)

1. Connecter le repo à Vercel
2. Configurer toutes les variables d'environnement dans le dashboard Vercel
3. Exécuter les migrations avant le premier déploiement : `npm run db:migrate`
4. Déployer — les Server Components et API Routes fonctionnent out-of-the-box

---

## Sécurité

- Sessions JWT signées (7 jours, sliding refresh 24h), cookies `httpOnly secure sameSite=strict`
- Mots de passe hashés avec bcrypt (12 rounds)
- Validation Zod côté serveur sur **toutes** les entrées API
- Rate limiting sur les routes sensibles (login, forum posts/comments)
- Headers de sécurité : CSP, HSTS, X-Frame-Options, etc.
- Documents jamais servis depuis `/public` — toujours via route API avec contrôle des permissions
- Logs d'audit sur toutes les actions sensibles (login, upload, suppression, changement de rôle)
