# Bac 242

Bibliothèque **collaborative, libre et gratuite** des annales (sujets et
corrigés) du baccalauréat congolais. Site statique, pensé pour le mobile et la
consultation hors-ligne.

> Projet à ses débuts. Séries A, C, D (enseignement général). Le site n'affiche
> que les ressources réellement disponibles.

## Stack technique

- **[Astro](https://astro.build)** : site statique, HTML rapide, JS minimal.
- **Content Collections** : contenu en fichiers Markdown versionnables, schémas
  Zod avec une **taxonomie partagée** prête pour d'autres types de ressources
  (cours, fiches…) — voir `src/lib/ressources.ts`.
- **Tailwind CSS v4** : interface mobile-first (bleu nuit + turquoise), design
  tokens sémantiques (`src/styles/global.css`) et **mode sombre** (bascule
  clair / sombre / système dans l'en-tête, clair par défaut, sans flash au
  chargement).
- **PWA** (`@vite-pwa/astro`) : installation et consultation hors-ligne.
- **Sécurité** : en-têtes HTTP durcis via `public/_headers` — CSP stricte (les
  scripts inline sont interdits, à l'exception du script anti-FOUC autorisé
  par hash), X-Frame-Options, Referrer-Policy, Permissions-Policy.
- **SEO / partage** : Open Graph + Twitter Card, données structurées schema.org,
  image de partage générée (`public/og.png`).
- **Cloudflare** (Pages Functions + R2 + D1) : API de soumission et file de
  modération, **Turnstile** (anti-spam), **Web Analytics** (sans cookie).
  L'espace admin est protégé par **Cloudflare Access** avec vérification
  cryptographique du jeton (JWT). Voir [DEPLOY.md](DEPLOY.md).
- **Pagefind** : recherche plein texte statique sur `/recherche` (facettes
  série / matière / année), indexée à chaque build, utilisable hors-ligne.
- **Vitest** : tests unitaires des fonctions pures (helpers de données, nommage
  des fichiers) et **garde-fou de contrastes WCAG AA** sur les couleurs des
  deux thèmes (`src/styles/tokens.test.ts`).

## Concept

Une fiche par sujet : **métadonnées** (année, série, matière, session) + un
**PDF du sujet** et/ou un **PDF du corrigé**.

Les visiteurs **soumettent un PDF** via `/contribuer` (un seul fichier par envoi,
en précisant s'il s'agit d'un sujet ou d'un corrigé) ; il est mis en file
d'attente (R2 + D1). Un mainteneur le **valide** depuis `/admin` (protégé par
Cloudflare Access) ; la validation **commite** le document dans le dépôt, ce qui
reconstruit le site. Le contenu reste donc versionné dans git.

### Contribution et attribution (esprit Wikipédia)

Le formulaire **ne collecte aucune donnée de contact** (pas d'e-mail). À la place,
à la manière de Wikipédia :

- le contributeur peut indiquer un **crédit** public (pseudonyme, ou rester
  anonyme), affiché sur la fiche et inscrit dans l'historique git ;
- chaque envoi déclare l'**origine** du document (sujet officiel, corrigé
  personnel, corrigé d'un tiers avec autorisation) et confirme une **déclaration
  de droits** ; un corrigé porte une **source / auteur** publiée en attribution ;
- la page [`/contributeurs`](/contributeurs) liste les crédits.

Pour toute question, le bouton **« Contactez-nous »** (menu « Le projet ») ouvre
la messagerie de l'utilisateur via un lien `mailto`, sans rien enregistrer.

## Démarrage

```bash
npm install
npm run dev        # serveur de développement (http://localhost:4321)
npm run build      # génère le site statique dans dist/ + index de recherche Pagefind
npm run preview    # prévisualise le site généré
npm test           # lance les tests unitaires (Vitest)
npm run test:watch # tests en mode interactif
```

> La page `/recherche` n'est fonctionnelle qu'après un build (l'index Pagefind
> n'existe pas sous `astro dev`) : utilisez `npm run build && npm run preview`.

## Structure

```
src/
  content/config.ts      # schémas (Zod) des collections + taxonomie partagée
  content/series/*.md     # séries (A, C, D)
  content/sujets/*.md     # fiches : métadonnées + chemins des PDF
  components/             # SujetCarte, Filtres, Icone, BadgeStatut, Fil, BasculeTheme…
  layouts/Layout.astro    # gabarit + SEO/Open Graph + PWA + anti-FOUC du thème
  pages/                  # accueil, /series, /annees, /matieres, /sujets, /recherche, /contribuer, /contributeurs, /a-propos, 404
  pages/admin/            # modération (protégé par Cloudflare Access)
  lib/data.ts             # helpers annales (tri, regroupements, statut, pastilles/icônes)
  lib/ressources.ts       # registre des catégories de ressources (nav/accueil en dérivent)
  styles/global.css       # design tokens (clair/sombre) + utilitaires
  **/*.test.ts            # tests unitaires (Vitest), co-localisés avec le code
functions/                # Pages Functions : /api/submit, /api/admin/* (+ _lib)
scripts/make-og-image.mjs # génère l'image de partage Open Graph
test/stubs/               # stubs pour les tests (ex. astro:content)
public/                   # favicon, icône PWA, og.png, PDF des sujets, _headers (CSP)
wrangler.toml, schema.sql # config Cloudflare (D1/R2) + schéma de modération
vitest.config.ts          # configuration des tests
```

## Tests

Tests unitaires avec **Vitest**, ciblant les fonctions pures (helpers de
[src/lib/data.ts](src/lib/data.ts) et utilitaires de
[functions/_lib/util.ts](functions/_lib/util.ts)) : pas de dépendance à Astro ni
à Cloudflare au runtime. Le module virtuel `astro:content` est remplacé par un
stub (voir [vitest.config.ts](vitest.config.ts)).

[src/styles/tokens.test.ts](src/styles/tokens.test.ts) vérifie en outre que
chaque paire fond/texte des deux thèmes (clair et sombre) atteint un contraste
**WCAG AA ≥ 4.5:1** : ajouter une paire `--x-bg` / `--x-fg` dans
`global.css` suffit pour qu'elle soit couverte.

```bash
npm test           # une passe
npm run test:watch # mode interactif
```

## Contribuer

Le plus simple : le formulaire `/contribuer` (envoi d'un PDF, sans connaissance
technique). Détails et ajout manuel dans [CONTRIBUTING.md](CONTRIBUTING.md).

## Configuration

Variables publiques (au build) : copier `.env.example` en `.env`.

- `PUBLIC_TURNSTILE_SITEKEY` : widget anti-spam du formulaire (optionnel)
- `PUBLIC_CF_BEACON_TOKEN` : analytics Cloudflare sans cookie (optionnel)

Sans ces clés, le site fonctionne (sans captcha ni statistiques). Les secrets
serveur et la mise en place complète sont décrits dans [DEPLOY.md](DEPLOY.md).

## Licence

Le **code** est publié sous licence **MIT** (voir [LICENSE](LICENSE)).

Le **contenu pédagogique** (sujets et corrigés) **n'est pas** couvert par cette
licence : il reste la propriété de ses auteurs et est publié avec leur
autorisation. Merci de ne pas le réutiliser sans l'accord des ayants droit, et
de conserver l'attribution affichée sur chaque document.
