import { defineCollection, z } from 'astro:content';

/**
 * Taxonomie commune à toutes les ressources pédagogiques du site : les
 * annales aujourd'hui, d'autres types demain (cours, fiches de révision,
 * exercices…). Chaque future collection définit son propre schéma en
 * étendant cette base, par exemple :
 *
 *   const fiches = defineCollection({
 *     type: 'content',
 *     schema: taxonomie.extend({ niveau: z.string() }),
 *   });
 *
 * Le registre des catégories de ressources vit dans src/lib/ressources.ts.
 */
export const taxonomie = z.object({
  matiere: z.string(),
  serie: z.string().optional(), // référence le `code` d'une série
  annee: z.number().int().optional(),
});

/**
 * Séries du baccalauréat congolais (enseignement général).
 * Un fichier Markdown par série, décrivant son intitulé.
 */
const series = defineCollection({
  type: 'content',
  schema: z.object({
    code: z.string(), // ex: "D", "A1"
    intitule: z.string(),
    filiere: z.enum(['Générale', 'Technique']),
    ordre: z.number().default(99),
  }),
});

/**
 * Sujets de la bibliothèque d'annales : métadonnées de classement + un PDF
 * du sujet et/ou un PDF du corrigé (les deux optionnels). Aucun corrigé
 * rédigé : seuls les documents PDF font foi.
 */
const sujets = defineCollection({
  type: 'content',
  schema: taxonomie.required({ serie: true, annee: true }).extend({
    session: z.enum(['Normale', 'Remplacement', 'Spéciale']).default('Normale'),
    sujetPdf: z.string().optional(), // chemin public vers le PDF du sujet
    corrigePdf: z.string().optional(), // chemin public vers le PDF du corrigé
    source: z.string().optional(), // attribution (auteur / origine des documents)
    credit: z.string().optional(), // crédit public du contributeur (pseudonyme)
  }),
});

export const collections = { series, sujets };
