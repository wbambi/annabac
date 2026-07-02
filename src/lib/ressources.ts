/**
 * Registre des catégories de ressources pédagogiques du site.
 *
 * Aujourd'hui, une seule catégorie existe : les annales. Quand d'autres
 * arriveront (cours, fiches de révision, exercices…) :
 *  1. ajouter une entrée ici (cle, libellé, axes de navigation) ;
 *  2. créer sa collection dans src/content/config.ts en étendant `taxonomie` ;
 *  3. créer son module de requêtes (src/lib/cours.ts…) — data.ts reste celui
 *     des annales ;
 *  4. réserver ses routes sous /ressources/<cle>/ ou un préfixe dédié : les
 *     routes actuelles des annales (/series, /annees, /matieres, /sujets)
 *     sont indexées et ne doivent pas changer. Une page d'index des
 *     catégories (/ressources) n'a de sens qu'à partir de deux entrées.
 *
 * La navigation du Layout et la section « Parcourir » de l'accueil sont
 * dérivées de ce registre.
 */

export interface AxeRessource {
  /** Route de l'axe (ex. /series). */
  href: string;
  /** Libellé court pour la barre de navigation. */
  label: string;
  /** Titre de la carte sur la page d'accueil. */
  titre: string;
  /** Sous-titre de la carte sur la page d'accueil. */
  description: string;
  /** Nom d'icône (src/components/Icone.astro). */
  icone: string;
  /** Classe de pastille colorée (global.css). */
  pastille: string;
}

export interface CategorieRessource {
  /** Identifiant stable (slug). */
  cle: string;
  libelle: string;
  description: string;
  icone: string;
  /** Route d'entrée de la catégorie. */
  href: string;
  /** Axes de parcours internes à la catégorie. */
  axes: AxeRessource[];
}

export const CATEGORIES: CategorieRessource[] = [
  {
    cle: 'annales',
    libelle: 'Annales',
    description: 'Sujets et corrigés du baccalauréat, classés par série, matière et année.',
    icone: 'stack',
    href: '/series',
    axes: [
      {
        href: '/series',
        label: 'Séries',
        titre: 'Par série',
        description: 'A · C · D',
        icone: 'stack',
        pastille: 'pastille-teal',
      },
      {
        href: '/annees',
        label: 'Années',
        titre: 'Par année',
        description: 'par session',
        icone: 'calendar',
        pastille: 'pastille-brand',
      },
      {
        href: '/matieres',
        label: 'Matières',
        titre: 'Par matière',
        description: 'par discipline',
        icone: 'book',
        pastille: 'pastille-ambre',
      },
    ],
  },
];
