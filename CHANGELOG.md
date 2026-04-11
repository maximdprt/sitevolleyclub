# Changelog — Lacanau Volley-Ball

Toutes les modifications notables du projet sont listées ici (ordre antéchronologique par lot logique).

## 2026-04-11 — Refonte auth, espaces membre/admin, SEO

### Authentification & navigation publique

- `src/app/page.tsx` : accueil vitrine restauré, métadonnées SEO, titre `<h1>` accessible (`.sr-only`).
- `src/components/providers/AppProviders.tsx`, `SiteChrome`, `LoginModal`, `AuthModalListener` : session NextAuth, modale `?auth=1&next=`.
- `src/components/ui/Navbar.tsx` : lien « Actualités », connexion / avatar.
- `src/middleware.ts`, `src/lib/permissions.ts` : protection des préfixes, redirection `/espace-adherent` → `/espace-membre`.

### Espace membre & admin

- `src/app/(dashboard)/espace-membre/*` : tableau de bord (matchs, entraînements, événements, convocations, documents publics), actions `respondConvocationAction`.
- `src/app/(dashboard)/admin/*` : `dashboard`, `matchs`, `entrainements`, `evenements`, `articles`, `membres`, `galerie` + `admin/_actions.ts` (Zod, CRUD).
- `src/lib/admin-ui.ts` : libellés des jours pour les créneaux.

### Données

- `prisma/schema.prisma` + migration manuelle : `Team`, `ClubMatch`, `TrainingSlot`, `ClubEvent`, `Article`, galerie, convocations, champs `User`.
- `prisma/seed.ts` : équipes par défaut pour les formulaires admin.

### SEO & contenu public

- `src/lib/seo.ts`, `publicPageMetadata` : titres, descriptions, mots-clés, Open Graph, Twitter, canonical.
- `src/app/layout.tsx` : gabarit de titre `%s | Lacanau Volley-Ball`.
- Pages publiques : métadonnées harmonisées (`le-club`, `pratique`, `calendrier`, `contact`, `infos`, etc.).
- `src/app/actualites/page.tsx`, `src/app/actualites/[slug]/page.tsx` : liste et article (JSON-LD `NewsArticle`).
- `src/app/sitemap.ts`, `src/app/robots.ts` : URLs statiques + articles publiés ; exclusion `/admin`, `/espace-membre`, `/api`, etc.
- `src/components/seo/HomeJsonLd.tsx` : JSON-LD `SportsOrganization` sur l’accueil.

### À faire côté déploiement

- Appliquer les migrations Prisma sur la base Supabase (`migrate deploy` ou équivalent) puis `npx prisma generate`.
- Vérifier `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`.

### Reporté (hors périmètre initial)

- Édition inline des pages vitrine par un admin (complexité élevée) : non implémenté ; le contenu éditorial passe par `/admin/articles` et `/actualites`.
