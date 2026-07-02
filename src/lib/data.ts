import { getCollection, type CollectionEntry } from 'astro:content';
import matieresParSerieData from '../../shared/matieres.json';

export type Sujet = CollectionEntry<'sujets'>;
export type Serie = CollectionEntry<'series'>;

/**
 * Matières proposées à la soumission, par série. Source unique partagée avec la
 * validation serveur (functions/_lib/util.ts) via shared/matieres.json.
 */
export const MATIERES_PAR_SERIE: Record<string, string[]> = matieresParSerieData;

/** Matières d'une série donnée (liste vide si série inconnue). */
export function matieresDeSerie(code: string): string[] {
  return MATIERES_PAR_SERIE[code] ?? [];
}

/** Union de toutes les matières (toutes séries confondues). */
export const MATIERES_COURANTES = [
  ...new Set(Object.values(MATIERES_PAR_SERIE).flat()),
];

/** Clé unique d'un sujet : année · série · matière · session. */
export function cleSujet(data: {
  annee: number | string;
  serie: string;
  matiere: string;
  session: string;
}): string {
  return `${data.annee}|${data.serie}|${data.matiere}|${data.session}`;
}

/**
 * Style d'une matière : classe de pastille + icône. Les couleurs vivent dans
 * global.css (classes .pastille-*, déclinées en clair et en sombre) — jamais
 * de hex ici, pour que tout suive le thème actif.
 */
export interface StyleMatiere {
  classe: string;
  icon: string;
}

const STYLES_MATIERE: Record<string, StyleMatiere> = {
  Mathématiques: { classe: 'pastille-maths', icon: 'calculator' },
  'Physique-Chimie': { classe: 'pastille-physique', icon: 'atom' },
  SVT: { classe: 'pastille-svt', icon: 'leaf' },
  Philosophie: { classe: 'pastille-philo', icon: 'bulb' },
  Français: { classe: 'pastille-francais', icon: 'book' },
  'Histoire-Géographie': { classe: 'pastille-histoire-geo', icon: 'globe' },
  Anglais: { classe: 'pastille-anglais', icon: 'language' },
  Espagnol: { classe: 'pastille-espagnol', icon: 'language' },
};

const NB_RAMPS = 8;

/** Ensemble fini des classes de pastille existant dans global.css. */
export const CLASSES_PASTILLE: ReadonlySet<string> = new Set([
  ...Object.values(STYLES_MATIERE).map((s) => s.classe),
  ...Array.from({ length: NB_RAMPS }, (_, i) => `pastille-ramp-${i}`),
  'pastille-serie-a',
  'pastille-serie-c',
  'pastille-serie-d',
  'pastille-serie-defaut',
]);

export function styleMatiere(matiere: string): StyleMatiere {
  const trouve = STYLES_MATIERE[matiere];
  if (trouve) return trouve;
  let h = 0;
  for (const c of matiere) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return { classe: `pastille-ramp-${h % NB_RAMPS}`, icon: 'file' };
}

/** Classe de pastille par série. */
const SERIES_CONNUES = new Set(['a', 'c', 'd']);

export function styleSerie(code: string): { classe: string } {
  const c = code.toLowerCase();
  return {
    classe: SERIES_CONNUES.has(c) ? `pastille-serie-${c}` : 'pastille-serie-defaut',
  };
}

/** Slug d'URL (sans accents, minuscule, tirets) pour matières/séries. */
export function slugify(valeur: string): string {
  return valeur
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // retire les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Titre lisible dérivé des métadonnées. */
export function titreSujet(data: Sujet['data']): string {
  return `Baccalauréat ${data.annee} — Série ${data.serie} — ${data.matiere}`;
}

/** Statut d'un sujet, déduit des PDF disponibles. */
export function statutSujet(
  data: Sujet['data']
): 'complet' | 'sujet' | 'corrige' | 'a-venir' {
  const s = Boolean(data.sujetPdf);
  const c = Boolean(data.corrigePdf);
  if (s && c) return 'complet';
  if (s) return 'sujet';
  if (c) return 'corrige';
  return 'a-venir';
}

export const libelleStatut: Record<string, string> = {
  complet: 'Sujet + corrigé',
  sujet: 'Sujet seul',
  corrige: 'Corrigé seul',
  'a-venir': 'À venir',
};

/** Tous les sujets, triés du plus récent au plus ancien. */
export async function tousLesSujets(): Promise<Sujet[]> {
  const sujets = await getCollection('sujets');
  return sujets.sort((a, b) => {
    if (b.data.annee !== a.data.annee) return b.data.annee - a.data.annee;
    return a.data.matiere.localeCompare(b.data.matiere, 'fr');
  });
}

/** Toutes les séries, dans l'ordre d'affichage défini. */
export async function toutesLesSeries(): Promise<Serie[]> {
  const series = await getCollection('series');
  return series.sort((a, b) => a.data.ordre - b.data.ordre);
}

/** Matières distinctes d'une série, avec le nombre de sujets. */
export async function matieresParSerie(
  codeSerie: string
): Promise<{ matiere: string; nombre: number }[]> {
  const sujets = await tousLesSujets();
  const compte = new Map<string, number>();
  for (const s of sujets) {
    if (s.data.serie !== codeSerie) continue;
    if (statutSujet(s.data) === 'a-venir') continue; // seulement le disponible
    compte.set(s.data.matiere, (compte.get(s.data.matiere) ?? 0) + 1);
  }
  return [...compte.entries()]
    .map(([matiere, nombre]) => ({ matiere, nombre }))
    .sort((a, b) => a.matiere.localeCompare(b.matiere, 'fr'));
}

/** Sujets d'une série + matière donnée. */
export async function sujetsParSerieMatiere(
  codeSerie: string,
  slugMatiere: string
): Promise<Sujet[]> {
  const sujets = await tousLesSujets();
  return sujets.filter(
    (s) => s.data.serie === codeSerie && slugify(s.data.matiere) === slugMatiere
  );
}

/** Années distinctes (les plus récentes d'abord), avec le nombre de sujets. */
export async function toutesLesAnnees(): Promise<
  { annee: number; nombre: number }[]
> {
  const sujets = await tousLesSujets();
  const compte = new Map<number, number>();
  for (const s of sujets) {
    if (statutSujet(s.data) === 'a-venir') continue; // seulement le disponible
    compte.set(s.data.annee, (compte.get(s.data.annee) ?? 0) + 1);
  }
  return [...compte.entries()]
    .map(([annee, nombre]) => ({ annee, nombre }))
    .sort((a, b) => b.annee - a.annee);
}

/** Matières distinctes (toutes séries), avec le nombre de sujets. */
export async function toutesLesMatieres(): Promise<
  { matiere: string; nombre: number }[]
> {
  const sujets = await tousLesSujets();
  const compte = new Map<string, number>();
  for (const s of sujets) {
    if (statutSujet(s.data) === 'a-venir') continue; // seulement le disponible
    compte.set(s.data.matiere, (compte.get(s.data.matiere) ?? 0) + 1);
  }
  return [...compte.entries()]
    .map(([matiere, nombre]) => ({ matiere, nombre }))
    .sort((a, b) => a.matiere.localeCompare(b.matiere, 'fr'));
}

/** Sujets d'une année donnée. */
export async function sujetsParAnnee(annee: number): Promise<Sujet[]> {
  const sujets = await tousLesSujets();
  return sujets.filter((s) => s.data.annee === annee);
}

/** Sujets d'une matière donnée (toutes séries / années). */
export async function sujetsParMatiere(slugMatiere: string): Promise<Sujet[]> {
  const sujets = await tousLesSujets();
  return sujets.filter((s) => slugify(s.data.matiere) === slugMatiere);
}

/**
 * Crédits publics des contributeurs : à la manière de l'historique de
 * Wikipédia, on liste les pseudonymes ayant partagé des documents, avec le
 * nombre de fiches concernées. Triés par nombre décroissant puis alphabétique.
 */
export async function contributeurs(): Promise<
  { credit: string; nombre: number }[]
> {
  const sujets = await tousLesSujets();
  const compte = new Map<string, number>();
  for (const s of sujets) {
    const credit = s.data.credit?.trim();
    if (!credit) continue;
    compte.set(credit, (compte.get(credit) ?? 0) + 1);
  }
  return [...compte.entries()]
    .map(([credit, nombre]) => ({ credit, nombre }))
    .sort((a, b) => b.nombre - a.nombre || a.credit.localeCompare(b.credit, 'fr'));
}
