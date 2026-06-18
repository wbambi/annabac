/// <reference types="@cloudflare/workers-types" />
import { type Env, json } from '../../_lib/util';
import { adminEmail } from '../../_lib/access';

/** Diffuse un PDF en attente depuis R2 pour l'aperçu admin. */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!adminEmail(request)) return json({ error: 'Non autorisé' }, 403);

  const key = new URL(request.url).searchParams.get('key') ?? '';
  // On ne sert que les fichiers en attente.
  if (!key.startsWith('pending/')) return json({ error: 'Clé invalide' }, 400);

  const obj = await env.BUCKET.get(key);
  if (!obj) return json({ error: 'Introuvable' }, 404);

  return new Response(obj.body, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': 'inline',
      'cache-control': 'private, no-store',
    },
  });
};
