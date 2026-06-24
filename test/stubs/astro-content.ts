// Stub minimal du module virtuel `astro:content` pour les tests Vitest.
// Seul `getCollection` est utilisé au runtime par src/lib/data.ts ; les types
// (CollectionEntry, etc.) sont effacés à la compilation, donc inutiles ici.
export async function getCollection(): Promise<unknown[]> {
  return [];
}

export function defineCollection<T>(config: T): T {
  return config;
}

export const z: Record<string, unknown> = {};
