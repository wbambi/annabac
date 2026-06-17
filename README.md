# Annales Bac Congo

Bibliothèque numérique **gratuite** des sujets et corrigés du baccalauréat
congolais (Congo-Brazzaville). Pensée pour le smartphone, la connexion limitée
et la consultation hors-ligne.

> Un élève ne devrait pas être désavantagé dans sa préparation au baccalauréat
> simplement parce qu'il n'a pas accès aux bonnes ressources.

## Stack technique

- **[Astro](https://astro.build)** — site statique, HTML rapide, JS minimal.
- **Content Collections** — base de données en fichiers Markdown versionnables.
- **Tailwind CSS v4** — interface épurée, mobile-first.
- **KaTeX** (`remark-math` + `rehype-katex`) — formules mathématiques en LaTeX
  dans tous les corrigés : `$...$` (en ligne) et `$$...$$` (bloc).
- **Pagefind** — moteur de recherche statique (index généré au build).
- **PWA** (`@vite-pwa/astro`) — installation et consultation hors-ligne.

## Démarrage

```bash
npm install
npm run dev          # serveur de développement (http://localhost:4321)
npm run build        # génère le site statique + l'index de recherche
npm run preview      # prévisualise le site généré (recherche active)
```

> La recherche (Pagefind) n'est active qu'après `npm run build` / `npm run preview`.

## Structure

```
src/
  content/
    config.ts          # schémas (Zod) des collections
    series/*.md         # métadonnées des séries (A, B, C, D, E, G1, G2, F)
    sujets/*.md         # un sujet par fichier (corrigé = corps Markdown)
  components/           # SujetCarte, Filtres, BadgeStatut, Fil…
  layouts/Layout.astro  # gabarit mobile-first + PWA
  pages/                # accueil, /series, /sujets, /recherche…
  lib/data.ts           # helpers (tri, regroupements, slugify)
scripts/seed.mjs        # génère des sujets d'exemple (placeholders)
public/pdfs/            # PDF des sujets
```

## Contenus

La base est amorcée avec ~140 sujets d'exemple (statut `placeholder`) couvrant
5 années et toutes les séries, plus quelques corrigés rédigés en démonstration.
Pour ajouter du contenu réel, voir [CONTRIBUTING.md](CONTRIBUTING.md).

Régénérer les placeholders manquants (n'écrase jamais l'existant) :

```bash
node scripts/seed.mjs
```

## Déploiement

Sortie 100 % statique (`dist/`) : déployable gratuitement sur Cloudflare Pages,
Netlify ou GitHub Pages. Commande de build : `npm run build`, dossier publié :
`dist`. Penser à ajuster `site` dans `astro.config.mjs`.
