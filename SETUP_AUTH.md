# 🏐 Auth & Supabase — Guide de démarrage

Tout le système d’authentification est désormais branché à Supabase. Voici
les **3 dernières étapes** à faire de ton côté pour que tout fonctionne en local.

---

## ✅ Ce qui est déjà fait

- ✅ Projet Supabase **`gasyvupfimymreeyitur`** restauré et actif
- ✅ Toutes les tables Prisma (`User`, `PasswordReset`, etc.) sont créées
- ✅ Table **`EmailVerification`** ajoutée pour la vérification d’email
- ✅ Politique mot de passe **mise à 8 caractères + 1 caractère spécial obligatoire**
- ✅ Page UI **`/reset-password`** créée (elle n’existait pas)
- ✅ Page UI **`/verify-email`** créée
- ✅ Routes API : `register`, `verify-email`, `resend-verification`,
  `forgot-password`, `reset-password`
- ✅ Emails Resend stylisés (bienvenue, vérification, reset)
- ✅ Fichier **`.env.local`** créé avec les credentials Supabase
- ✅ Fichier **`.env.example`** créé pour le repo

---

## 🚀 Étapes finales à faire de ton côté

### 1. Installer les dépendances et générer Prisma

```bash
cd sitevolleyclub
npm install
npm run db:generate
```

> Le client Prisma a maintenant le modèle `EmailVerification` — la commande
> `db:generate` régénère le client TypeScript.

### 2. Vérifier la chaîne de connexion PostgreSQL

Ouvre **`.env.local`** et regarde la ligne `DATABASE_URL`. J’ai mis :

```
postgresql://postgres.gasyvupfimymreeyitur:Maxpab%2E222@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

Le mot de passe `Maxpab.222` a été URL-encodé (`.` → `%2E`).

👉 **Vérifie cette URL en la copiant depuis Supabase** :
- va sur [https://supabase.com/dashboard/project/gasyvupfimymreeyitur](https://supabase.com/dashboard/project/gasyvupfimymreeyitur)
- **Project Settings → Database → Connection string → URI**
- Mode **Transaction** (port `6543`) → c’est ta `DATABASE_URL`
- Mode **Session** (port `5432`) → c’est ta `DIRECT_URL`

Si le `host` que je t’ai mis (`aws-0-eu-west-1.pooler.supabase.com`) n’est pas
exact, remplace-le par celui affiché dans Supabase.

### 3. Créer un compte Resend pour les emails

Sans Resend, les emails de vérification ne partiront pas (mais l’inscription
fonctionne quand même — le user sera créé en base).

1. Va sur [https://resend.com](https://resend.com) → crée un compte (gratuit)
2. **API Keys → Create API Key** → copie la clé
3. Dans **`.env.local`**, colle :
   ```
   RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxx"
   ```
4. Pour les tests en local, garde `RESEND_FROM_EMAIL="onboarding@resend.dev"`
   (domaine Resend autorisé par défaut, n’envoie qu’aux adresses que tu as
   vérifiées dans Resend).
5. En production : configure ton domaine `lacanau-volley.fr` dans Resend
   (Domains → Add Domain → ajouter les DNS).

### 4. Lancer le serveur

```bash
npm run dev
```

Puis ouvre **[http://localhost:3000/register](http://localhost:3000/register)** et teste le parcours complet :

| Étape | Page | Effet attendu |
|-------|------|---------------|
| 1 | `/register` | Saisie → email envoyé, écran « vérifiez vos emails » |
| 2 | Inbox | Email avec bouton « Confirmer mon email » |
| 3 | `/verify-email?token=…` | Page de confirmation, statut **PENDING → ACTIVE par admin** |
| 4 | `/login` | Tant que `status = PENDING` → message « en attente de validation » |
| 5 | `/forgot-password` | Saisie email → reset envoyé |
| 6 | `/reset-password?token=…` | Nouveau MDP → succès, redirection login |

---

## 🔑 Politique mot de passe (comme demandé)

- **Minimum 8 caractères**
- **Au moins 1 caractère spécial** (`!@#$%^&*…`)
- La majuscule et le chiffre sont **conseillés** (UI les affiche) mais
  **plus obligatoires** (modifié depuis la version 12 chars)

---

## 🔐 Parcours d’authentification

```
┌──────────┐  POST /api/auth/register   ┌──────────────┐
│ register │ ───────────────────────────▶│ User PENDING │
└──────────┘                             │ + token créé │
     │                                   └──────┬───────┘
     │ Email Resend                             │
     ▼                                          ▼
"Vérifiez vos emails"                    /verify-email?token=…
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │ token validé │
                                         │ User: PENDING│
                                         │ (admin doit  │
                                         │  encore valider)
                                         └──────┬───────┘
                                                ▼
                                       Email "en attente
                                       de validation admin"
                                                │
                              Admin passe       │
                              status → ACTIVE   ▼
                                          /login OK
```

> ⚠️ **À noter** : par sécurité, un compte vérifié reste en **`PENDING`**
> jusqu’à validation explicite par un administrateur (logique métier
> existante du projet). Si tu veux que la vérification d’email passe
> automatiquement à `ACTIVE`, dis-le moi et je modifie en deux lignes.

---

## 🆘 Si quelque chose ne marche pas

| Erreur | Solution |
|--------|----------|
| `Can't reach database` | Vérifie `DATABASE_URL` — host et password depuis Supabase |
| `Password authentication failed` | Le `.` du MDP n’est pas encodé — vérifie `Maxpab%2E222` |
| `Table EmailVerification doesn't exist` | Run `npx prisma db push` |
| Email non reçu | Resend non configuré — vérifie `RESEND_API_KEY` |
| `Invalid `AUTH_SECRET`` | Vérifie qu’il fait au moins 32 caractères |

---

## 📁 Fichiers créés / modifiés

```
✏️  src/lib/validators/auth.ts                — MDP 8 chars + spécial + nouveaux schemas
✏️  src/lib/email.ts                          — Templates emails + sendVerificationEmail
✏️  src/app/api/auth/register/route.ts        — Crée token de vérification
✏️  src/app/api/auth/forgot-password/route.ts — Fallback AUTH_URL
✏️  src/app/(auth)/register/page.tsx          — UI 8 chars + écran "vérifiez vos emails"
✏️  prisma/schema.prisma                      — Modèle EmailVerification ajouté
✨ src/app/api/auth/verify-email/route.ts     — NOUVEAU
✨ src/app/api/auth/resend-verification/route.ts — NOUVEAU
✨ src/app/(auth)/verify-email/page.tsx       — NOUVEAU
✨ src/app/(auth)/reset-password/page.tsx     — NOUVEAU (manquait)
✨ .env.local                                 — NOUVEAU avec credentials Supabase
✨ .env.example                               — NOUVEAU
✨ SETUP_AUTH.md                              — Ce fichier
```

Bonne suite ! 🏐
