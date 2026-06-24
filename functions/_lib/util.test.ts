import { describe, it, expect } from 'vitest';
import { slugify, baseNom, json } from './util';

describe('slugify', () => {
  it('retire les accents et passe en minuscules', () => {
    expect(slugify('Mathématiques')).toBe('mathematiques');
    expect(slugify('Histoire-Géographie')).toBe('histoire-geographie');
  });

  it('remplace espaces et caractères spéciaux par des tirets', () => {
    expect(slugify('Arts plastiques')).toBe('arts-plastiques');
    expect(slugify('Physique-Chimie')).toBe('physique-chimie');
  });

  it('rogne les tirets en début et fin', () => {
    expect(slugify('  Espacé !! ')).toBe('espace');
  });
});

describe('baseNom', () => {
  it("omet la session quand elle est 'Normale'", () => {
    expect(
      baseNom({ annee: 2020, serie: 'C', matiere: 'Mathématiques', session: 'Normale' })
    ).toBe('2020-serie-c-mathematiques');
  });

  it('inclut la session quand elle est différente de Normale', () => {
    expect(
      baseNom({ annee: 2019, serie: 'D', matiere: 'Physique-Chimie', session: 'Remplacement' })
    ).toBe('2019-serie-d-physique-chimie-remplacement');
    expect(
      baseNom({ annee: 2021, serie: 'A', matiere: 'Français', session: 'Spéciale' })
    ).toBe('2021-serie-a-francais-speciale');
  });

  it('accepte une année sous forme de chaîne', () => {
    expect(
      baseNom({ annee: '2020', serie: 'C', matiere: 'SVT', session: 'Normale' })
    ).toBe('2020-serie-c-svt');
  });
});

describe('json', () => {
  it('renvoie une Response JSON avec le bon statut et le content-type', async () => {
    const res = json({ success: true }, 201);
    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(201);
    expect(res.headers.get('content-type')).toContain('application/json');
    expect(await res.json()).toEqual({ success: true });
  });

  it('utilise le statut 200 par défaut', () => {
    expect(json({}).status).toBe(200);
  });
});
