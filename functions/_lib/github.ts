/// <reference types="@cloudflare/workers-types" />
import type { Env } from './util';

const API = 'https://api.github.com';

function headers(env: Env): HeadersInit {
  return {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'annabac-moderation',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function repo(env: Env): string {
  return `${env.GITHUB_OWNER}/${env.GITHUB_REPO}`;
}

/** Contenu texte d'un fichier du dépôt, ou null s'il n'existe pas. */
export async function getFileText(env: Env, path: string): Promise<string | null> {
  const url = `${API}/repos/${repo(env)}/contents/${encodeURIComponent(path)}?ref=${env.GITHUB_BRANCH}`;
  const res = await fetch(url, { headers: headers(env) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`getFile ${path}: ${res.status}`);
  const data = (await res.json()) as { content: string };
  return decodeBase64Utf8(data.content.replace(/\n/g, ''));
}

export interface FichierACommiter {
  path: string;
  /** Contenu binaire encodé base64 (PDF) … */
  contentBase64?: string;
  /** … ou contenu texte (md). */
  contentText?: string;
}

/**
 * Commite plusieurs fichiers en un seul commit (API Git Data) puis avance la
 * branche. Renvoie le SHA du commit créé.
 */
export async function commitFiles(
  env: Env,
  fichiers: FichierACommiter[],
  message: string
): Promise<string> {
  const r = repo(env);
  const h = headers(env);

  // 1) Réf + commit + arbre courants
  const refRes = await fetch(`${API}/repos/${r}/git/ref/heads/${env.GITHUB_BRANCH}`, { headers: h });
  if (!refRes.ok) throw new Error(`ref: ${refRes.status}`);
  const refData = (await refRes.json()) as { object: { sha: string } };
  const baseCommitSha = refData.object.sha;

  const commitRes = await fetch(`${API}/repos/${r}/git/commits/${baseCommitSha}`, { headers: h });
  const commitData = (await commitRes.json()) as { tree: { sha: string } };
  const baseTreeSha = commitData.tree.sha;

  // 2) Créer un blob par fichier
  const treeEntries = [];
  for (const f of fichiers) {
    const body = f.contentBase64 !== undefined
      ? { content: f.contentBase64, encoding: 'base64' }
      : { content: f.contentText ?? '', encoding: 'utf-8' };
    const blobRes = await fetch(`${API}/repos/${r}/git/blobs`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify(body),
    });
    if (!blobRes.ok) throw new Error(`blob ${f.path}: ${blobRes.status}`);
    const blob = (await blobRes.json()) as { sha: string };
    treeEntries.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha });
  }

  // 3) Arbre, 4) commit, 5) avancer la réf
  const treeRes = await fetch(`${API}/repos/${r}/git/trees`, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }),
  });
  if (!treeRes.ok) throw new Error(`tree: ${treeRes.status}`);
  const tree = (await treeRes.json()) as { sha: string };

  const newCommitRes = await fetch(`${API}/repos/${r}/git/commits`, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({ message, tree: tree.sha, parents: [baseCommitSha] }),
  });
  if (!newCommitRes.ok) throw new Error(`commit: ${newCommitRes.status}`);
  const newCommit = (await newCommitRes.json()) as { sha: string };

  const updateRes = await fetch(`${API}/repos/${r}/git/refs/heads/${env.GITHUB_BRANCH}`, {
    method: 'PATCH',
    headers: h,
    body: JSON.stringify({ sha: newCommit.sha }),
  });
  if (!updateRes.ok) throw new Error(`update ref: ${updateRes.status}`);

  return newCommit.sha;
}

function decodeBase64Utf8(b64: string): string {
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
