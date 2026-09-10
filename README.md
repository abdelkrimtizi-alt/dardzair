# DarDzair

Clone d'Airbnb pour le marché algérien, trilingue (FR / AR / EN), identité visuelle inspirée du zellige et des couleurs du Sahara.

## Stack

- **Next.js 14** (App Router) — front + API routes
- **Tailwind CSS** — styles, palette custom dans `tailwind.config.js`
- **next-intl** — gestion FR / AR (RTL) / EN
- **Supabase** — base de données Postgres, auth, stockage des photos

## Démarrer en local

1. Installer les dépendances :
   ```bash
   npm install
   ```

2. Créer un projet sur [supabase.com](https://supabase.com) (gratuit).

3. Copier `.env.local.example` vers `.env.local` et remplir avec tes clés Supabase
   (Project Settings → API dans le dashboard Supabase) :
   ```bash
   cp .env.local.example .env.local
   ```

4. Dans Supabase → SQL Editor, exécuter dans l'ordre :
   - `supabase/schema.sql` (tables + policies de base)
   - `supabase/schema_v2.sql` (bucket photos + policy pour confirmer/refuser une réservation)

5. Lancer le serveur de dev :
   ```bash
   npm run dev
   ```

6. Ouvrir [http://localhost:3000](http://localhost:3000) — tu seras redirigé vers `/fr`.

## Structure

```
app/[locale]/       → pages (une arborescence par langue, gérée par next-intl)
  search/            → résultats de recherche (?city=...&start=...&end=...)
  listing/[id]/       → détail d'une annonce + réservation
  login/, signup/      → authentification
  trips/               → réservations du voyageur connecté
  host/new/            → publier une annonce (avec photo)
  host/dashboard/      → gérer les demandes de réservation reçues
components/          → Header, Hero, ListingCard, AuthForm, BookingForm, NewListingForm, HostDashboard, MyTrips
messages/            → fr.json, ar.json, en.json (textes traduits)
lib/                  → supabaseClient.js, listings.js
supabase/             → schema.sql, schema_v2.sql (à exécuter dans Supabase)
```

## Ce qui est déjà en place

- Page d'accueil avec hero, recherche par ville + dates, grille d'annonces (connectée à Supabase, repli sur données factices si vide)
- Routing trilingue avec bascule de langue et RTL automatique pour l'arabe
- Palette et typographie définies (voir `tailwind.config.js`)
- Schéma de base de données Supabase avec RLS (`supabase/schema.sql`, `supabase/schema_v2.sql`)
- Inscription / connexion par email (`/login`, `/signup`) via Supabase Auth
- Page de détail d'une annonce avec formulaire de demande de réservation
- Recherche par ville et par disponibilité sur une période (`/search?city=...&start=...&end=...`)
- Espace hôte pour publier une annonce avec photo (`/host/new`)
- Tableau de bord hôte pour confirmer/refuser les demandes reçues (`/host/dashboard`)
- Espace voyageur pour suivre ses propres réservations (`/trips`)

## Prochaines étapes suggérées

1. **Emails de confirmation** : via Supabase Edge Functions ou un service comme Resend.
2. **Auth via session serveur** (`@supabase/ssr`) pour afficher l'état connecté directement dans le header, sans clignotement côté client.
3. **Plusieurs photos par annonce** au lieu d'une seule.
4. **Avis / notes** sur les hôtes et les voyageurs après un séjour.

## Déploiement

Le plus simple : connecter ce repo à [Vercel](https://vercel.com), ajouter les mêmes
variables d'environnement que `.env.local`, et déployer.
