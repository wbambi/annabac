# Contribuer à Annales Bac Congo

Merci de votre aide ! Le projet est collaboratif : enseignants, anciens élèves,
développeurs et établissements peuvent contribuer.

## Façons de contribuer

- **Collecter / numériser** d'anciens sujets (PDF lisibles).
- **Vérifier** l'exactitude des contenus existants.
- **Rédiger** des corrigés pédagogiques.
- **Améliorer** le code et le design.

## Ajouter un sujet

1. Créez un fichier dans `src/content/sujets/`, nommé
   `<annee>-serie-<serie>-<matiere>.md` (sans accents), par ex.
   `2022-serie-c-mathematiques.md`.
2. Renseignez les métadonnées (frontmatter) :

   ```yaml
   ---
   titre: 'Baccalauréat 2022 — Série C — Mathématiques'
   annee: 2022
   serie: 'C' # A, B, C, D, E, G1, G2, F
   matiere: 'Mathématiques'
   session: 'Normale' # Normale | Remplacement | Spéciale
   duree: '4h'
   coefficient: 5
   difficulte: 'Difficile' # Facile | Moyenne | Difficile
   chapitres: ['Nombres complexes', 'Suites']
   sujetPdf: '/pdfs/2022-serie-c-mathematiques-sujet.pdf' # optionnel
   statut: 'corrige-disponible' # corrige-disponible | sujet-seul | placeholder
   ---
   ```

3. Rédigez le **corrigé** dans le corps du fichier (Markdown). Structure
   recommandée : démarche, notions mobilisées, pièges classiques, conseils.
4. Déposez le PDF du sujet (si disponible) dans `public/pdfs/` et référencez-le
   via `sujetPdf`.

## Qualité des corrigés

Un bon corrigé ne donne pas seulement la réponse : il explique **la démarche**,
les **notions du programme** mobilisées, les **pièges fréquents** et des
**conseils méthodologiques**.

**Formules mathématiques** : utilisez la syntaxe LaTeX, rendue automatiquement
par KaTeX. En ligne avec `$...$` (ex. `$f'(x) = 2x$`) ou en bloc centré avec
`$$...$$` (ex. `$$\int_0^1 x^2\,dx = \frac{1}{3}.$$`).

## Vérifier localement

```bash
npm install
npm run dev      # vérifier l'affichage
npm run build    # vérifier que tout compile (schémas Zod validés)
```

Les métadonnées sont validées par des schémas (`src/content/config.ts`) : une
valeur invalide (mauvais `statut`, `difficulte`…) fera échouer le build.
