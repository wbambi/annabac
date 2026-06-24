import { describe, it, expect } from 'vitest';
import {
  cleSujet,
  statutSujet,
  titreSujet,
  styleMatiere,
  libelleStatut,
} from './data';

const base = { annee: 2020, serie: 'C', matiere: 'Mathématiques', session: 'Normale' };

describe('cleSujet', () => {
  it('assemble année·série·matière·session', () => {
    expect(cleSujet(base)).toBe('2020|C|Mathématiques|Normale');
  });

  it('distingue deux sessions différentes', () => {
    expect(cleSujet({ ...base, session: 'Remplacement' })).not.toBe(cleSujet(base));
  });
});

describe('statutSujet', () => {
  it("'complet' quand sujet et corrigé sont présents", () => {
    expect(statutSujet({ ...base, sujetPdf: '/a.pdf', corrigePdf: '/b.pdf' })).toBe('complet');
  });

  it("'sujet' quand seul le sujet est présent", () => {
    expect(statutSujet({ ...base, sujetPdf: '/a.pdf' })).toBe('sujet');
  });

  it("'corrige' quand seul le corrigé est présent", () => {
    expect(statutSujet({ ...base, corrigePdf: '/b.pdf' })).toBe('corrige');
  });

  it("'a-venir' quand aucun PDF n'est présent", () => {
    expect(statutSujet({ ...base })).toBe('a-venir');
  });

  it('chaque statut a un libellé', () => {
    expect(libelleStatut.complet).toBeTruthy();
    expect(libelleStatut['a-venir']).toBeTruthy();
  });
});

describe('titreSujet', () => {
  it('formate un titre lisible', () => {
    expect(titreSujet(base)).toBe('Baccalauréat 2020 — Série C — Mathématiques');
  });
});

describe('styleMatiere', () => {
  it('renvoie le style dédié pour une matière connue', () => {
    expect(styleMatiere('Mathématiques').icon).toBe('calculator');
  });

  it('retombe sur un style générique déterministe pour une matière inconnue', () => {
    const a = styleMatiere('Latin');
    const b = styleMatiere('Latin');
    expect(a.icon).toBe('file');
    expect(a).toEqual(b); // déterministe (basé sur un hash du nom)
    expect(a.bg).toMatch(/^#/);
  });
});
