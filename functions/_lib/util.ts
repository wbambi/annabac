/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH: string;
  GITHUB_TOKEN?: string;
  TURNSTILE_SECRET?: string;
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

export function uuid(): string {
  return crypto.randomUUID();
}
