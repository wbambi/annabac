/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  GITHUB_TOKEN?: string;
  TURNSTILE_SECRET?: string;
  /** Domaine d'équipe Cloudflare Access, ex. `monequipe.cloudflareaccess.com`. */
  ACCESS_TEAM_DOMAIN?: string;
  /** Tag « Application Audience (AUD) » de l'application Access admin. */
  ACCESS_AUD?: string;
}

import matieresParSerie from '../../shared/matieres.json';

/**
 * Matières acceptées par série. Source unique partagée avec le front
 * (src/lib/data.ts) via shared/matieres.json.
 */
export const MATIERES_PAR_SERIE: Record<string, string[]> = matieresParSerie;

/** Vrai si la matière est valide pour cette série. */
export function matiereValide(serie: string, matiere: string): boolean {
  return (MATIERES_PAR_SERIE[serie] ?? []).includes(matiere);
}

/** Slug sans accents (identique à src/lib/data.ts). */
export function slugify(valeur: string): string {
  return valeur
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Base de nommage des fichiers : <annee>-serie-<serie>-<matiere>[-<session>]. */
export function baseNom(d: {
  annee: number | string;
  serie: string;
  matiere: string;
  session: string;
}): string {
  const session = d.session && d.session !== 'Normale' ? `-${slugify(d.session)}` : '';
  return `${d.annee}-serie-${slugify(d.serie)}-${slugify(d.matiere)}${session}`;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

/**
 * Réponse d'erreur serveur générique. On journalise le détail réel côté serveur
 * (visible dans les logs Cloudflare / `wrangler tail`) mais on ne renvoie au
 * client qu'un message neutre, sans fuite d'information interne.
 */
export function erreurServeur(contexte: string, e: unknown): Response {
  console.error(`[${contexte}]`, e);
  return json({ success: false, error: 'Erreur serveur. Réessayez plus tard.' }, 500);
}

export function uuid(): string {
  return crypto.randomUUID();
}
