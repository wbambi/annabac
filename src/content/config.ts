import { defineCollection, z } from 'astro:content';

/**
 * Séries du baccalauréat congolais (enseignement général + technique).
 * Un fichier Markdown par série, décrivant son intitulé et sa filière.
 */
const series = defineCollection({
  type: 'content',
  schema: z.object({
    code: z.string(), // ex: "D", "G1"
    intitule: z.string(), // ex: "Sciences exactes et naturelles"
    filiere: z.enum(['Générale', 'Technique']),
    couleur: z.string().default('emerald'), // teinte Tailwind pour l'UI
    ordre: z.number().default(99), // ordre d'affichage
  }),
});

/**
 * Sujets d'annales. Un fichier Markdown par sujet ; le corps contient
 * le corrigé pédagogique (démarche, notions, pièges, conseils).
 */
const sujets = defineCollection({
  type: 'content',
  schema: z.object({
    titre: z.string(),
    annee: z.number().int(),
    serie: z.string(), // référence le `code` d'une série
    matiere: z.string(),
    session: z.enum(['Normale', 'Remplacement', 'Spéciale']).default('Normale'),
    duree: z.string().optional(), // ex: "4h"
    coefficient: z.number().optional(),
    difficulte: z.enum(['Facile', 'Moyenne', 'Difficile']).default('Moyenne'),
    chapitres: z.array(z.string()).default([]),
    sujetPdf: z.string().optional(), // chemin public vers le PDF du sujet
    statut: z
      .enum(['corrige-disponible', 'sujet-seul', 'placeholder'])
      .default('placeholder'),
  }),
});

export const collections = { series, sujets };
