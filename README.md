# Echiquier ♟️

PWA personnelle d'echecs : base de donnees de parties (PGN), echiquier interactif,
revision d'ouvertures, mini-jeux et entrainement avec Stockfish.

Stack : **Vite** + JS vanilla · **chessground** (plateau) · **chess.js** (regles/PGN) ·
**Supabase** (auth + DB) · **vite-plugin-pwa** · hebergement **Vercel**.

## Demarrage local

```bash
npm install
cp .env.example .env.local   # puis remplis tes cles Supabase
npm run dev                  # http://localhost:5173
```

Sans cles Supabase l'app fonctionne en « mode local » : seul l'onglet **Jouer**
est disponible (l'echiquier interactif). La base de parties s'active des que
`.env.local` est rempli.

## Configuration Supabase

1. Cree un projet sur [supabase.com](https://supabase.com).
2. **Settings > API** : copie `Project URL` et `anon public key` dans `.env.local` :
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
3. **SQL Editor > New query** : colle le contenu de [`supabase/schema.sql`](supabase/schema.sql)
   et clique **Run** (cree les tables + securite RLS).
4. **Authentication > Providers** : active **Email**. (Tu peux desactiver la
   confirmation par e-mail pendant le dev : Auth > Settings.)

## Deploiement (GitHub + Vercel)

```bash
gh auth login          # une fois, en interactif
gh repo create echiquier --private --source . --push
```

Puis sur [vercel.com](https://vercel.com) : **Add New > Project** > importe le depot.
Dans les *Environment Variables* de Vercel, ajoute `VITE_SUPABASE_URL` et
`VITE_SUPABASE_ANON_KEY`. Vercel detecte Vite automatiquement.

## Etat actuel (MVP)

- [x] Echiquier interactif (coups legaux, navigation, retournement)
- [x] Import / sauvegarde de parties en PGN (Supabase)
- [x] Liste des parties + rejeu coup par coup
- [x] Auth e-mail + PWA installable
- [ ] Editeur d'arbre (variantes/sous-variantes nommees)
- [ ] Stockfish embarque (eval, meilleur coup)
- [ ] Jeu « trouve le meilleur coup », puzzles, revision SRS, mini-jeux

Voir le plan complet dans la conversation / roadmap.

## Structure

```
src/
  main.js            routeur (hash) + shell + auth
  supabase.js        client + helpers (auth, games)
  chess/pgn.js       parsing PGN -> positions/metadonnees
  ui/board.js        Board (jeu) + GameViewer (rejeu) sur chessground
  views/             auth · games (liste/import/lecture) · play
  styles/main.css    theme sombre
supabase/schema.sql  tables + RLS
```
