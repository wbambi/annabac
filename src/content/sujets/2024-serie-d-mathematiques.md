---
titre: 'Baccalauréat 2024 — Série D — Mathématiques'
annee: 2024
serie: 'D'
matiere: 'Mathématiques'
session: 'Normale'
duree: '4h'
coefficient: 4
difficulte: 'Moyenne'
chapitres: ['Probabilités', 'Fonctions', 'Nombres complexes']
sujetPdf: '/pdfs/2024-serie-d-mathematiques-sujet.pdf'
statut: 'corrige-disponible'
---

## Présentation du sujet

Le sujet comporte trois exercices indépendants et un problème, couvrant les
**probabilités conditionnelles**, l'étude d'une **fonction** et les **nombres
complexes**. *(Énoncé d'exemple à but de démonstration de la mise en forme.)*

## Exercice 1 — Probabilités

> Une urne contient 5 boules rouges et 3 boules vertes. On tire successivement
> deux boules sans remise.

### Démarche

1. **Modéliser** l'expérience par un arbre pondéré.
2. Probabilité de tirer deux rouges :
   $$P(R_1 \cap R_2) = \frac{5}{8} \times \frac{4}{7} = \frac{20}{56} = \frac{5}{14}.$$
3. Pour « au moins une verte », passer par l'événement contraire :
   $$P(\text{au moins une verte}) = 1 - P(R_1 \cap R_2) = 1 - \frac{5}{14} = \frac{9}{14}.$$

### Notions mobilisées

- Probabilités conditionnelles et arbre pondéré.
- Événement contraire.

### Pièges classiques

- Oublier le **sans remise** : le dénominateur passe de 8 à 7 au second tirage.
- Additionner des probabilités d'événements non disjoints.

## Exercice 2 — Étude de fonction

> Soit $f(x) = x\,e^{-x}$ définie sur $\mathbb{R}$.

### Démarche

- Dérivée : $f'(x) = (1 - x)\,e^{-x}$, du signe de $1 - x$.
- $f$ croît sur $]-\infty,\, 1]$, décroît sur $[1,\, +\infty[$ ; **maximum** en
  $x = 1$ valant $f(1) = \dfrac{1}{e}$.
- Limites : $\displaystyle\lim_{x \to +\infty} f(x) = 0^+$ et
  $\displaystyle\lim_{x \to -\infty} f(x) = -\infty$.

### Conseils méthodologiques

Toujours justifier le signe de la dérivée avant de dresser le tableau de
variations, puis confirmer par les limites aux bornes.

## Pour aller plus loin

- Réviser le chapitre **Probabilités** sur l'ensemble des annales de Série D.
- S'entraîner sur les sujets des années précédentes portant sur l'étude de
  fonctions exponentielles.
