# Déploiement — Cloudflare Pages + modération

Le site est statique (Astro → `dist/`) et l'API de soumission/modération tourne
en **Pages Functions** (dossier `functions/`), avec **R2** (stockage des PDF en
attente) et **D1** (file de modération). La validation publie le document en
**commitant dans le dépôt GitHub**, ce qui déclenche un nouveau build.

## Prérequis

```bash
npm i -g wrangler
wrangler login
```

## 1. Créer les ressources

```bash
# Base de données (file de modération)
wrangler d1 create annabac
# → copiez le database_id renvoyé dans wrangler.toml

# Stockage des PDF en attente
wrangler r2 bucket create annabac-soumissions

# Appliquer le schéma
wrangler d1 execute annabac --remote --file=schema.sql
```

## 2. Projet Pages

Connectez le dépôt `wbambi/annabac` à Cloudflare Pages (Git) :

- **Build command** : `npm run build`
- **Build output** : `dist`
- Le `wrangler.toml` fournit les bindings `DB` (D1) et `BUCKET` (R2).

## 3. Secrets et variables

```bash
# Jeton GitHub à portée "contents:write" sur le dépôt (publication des fiches)
wrangler pages secret put GITHUB_TOKEN --project-name annabac

# Clé secrète Turnstile (anti-robot)
wrangler pages secret put TURNSTILE_SECRET --project-name annabac
```

Dans le dashboard Pages → **Variables d'environnement** (build & production) :

- `PUBLIC_TURNSTILE_SITEKEY` = clé *site* Turnstile (injectée dans le formulaire au build)
- `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH` (déjà dans `wrangler.toml`)

## 4. Protéger l'espace admin (Cloudflare Access)

Zero Trust → **Access** → Applications → *Add a self-hosted application* :

- **Domaine** : `<votre-domaine>` chemins `/admin*` **et** `/api/admin/*`
- **Politique** : *Allow* limité à votre e-mail (ou un groupe d'admins)

Access injecte alors l'en-tête `Cf-Access-Authenticated-User-Email`, que les
fonctions admin vérifient en plus.

## 5. Turnstile

Cloudflare → **Turnstile** → créez un widget pour votre domaine. Reportez la clé
*site* dans `PUBLIC_TURNSTILE_SITEKEY` et la clé *secrète* via le secret
`TURNSTILE_SECRET`. Laissés vides, le widget est masqué et la vérification
ignorée (utile en local).

## Flux de bout en bout

1. Un visiteur envoie un PDF via `/contribuer` → `POST /api/submit`.
2. Le PDF va dans R2 (`pending/<id>/…`), une ligne `pending` est créée en D1.
3. Vous ouvrez `/admin` (derrière Access), vérifiez le PDF, puis **Valider**.
4. `/api/admin/decide` commite le PDF (`public/pdfs/…`) + la fiche
   (`src/content/sujets/…`) dans le dépôt → Pages reconstruit → document en ligne (~1 min).
5. **Rejeter** marque la soumission et supprime le PDF en attente.

## Développement local des fonctions (optionnel)

```bash
npm run build
wrangler pages dev dist   # sert dist/ + functions/ avec les bindings
```

Créez un fichier `.dev.vars` (non versionné) pour les secrets locaux :

```
GITHUB_TOKEN=...
TURNSTILE_SECRET=
```
