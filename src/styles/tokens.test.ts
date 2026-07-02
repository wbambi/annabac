/**
 * Garde-fou d'accessibilité : chaque paire fond/texte définie dans
 * global.css doit atteindre un contraste WCAG AA (≥ 4.5:1 pour du texte
 * courant), dans le thème clair comme dans le thème sombre.
 *
 * Le test parse les blocs `:root { … }` et `[data-theme='dark'] { … }` de
 * global.css : ajouter une paire `--x-bg`/`--x-fg` suffit pour qu'elle soit
 * couverte automatiquement.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const css = readFileSync(
  fileURLToPath(new URL('./global.css', import.meta.url)),
  'utf8'
);

/** Extrait les variables `--nom: #hex;` d'un bloc CSS donné. */
function variablesDuBloc(selecteur: string): Record<string, string> {
  const debut = css.indexOf(`${selecteur} {`);
  expect(debut, `bloc « ${selecteur} » introuvable dans global.css`).toBeGreaterThan(-1);
  const fin = css.indexOf('\n}', debut);
  const bloc = css.slice(debut, fin);
  const vars: Record<string, string> = {};
  for (const m of bloc.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    vars[m[1]] = m[2].toLowerCase();
  }
  return vars;
}

/** Luminance relative WCAG d'une couleur #rrggbb. */
function luminance(hex: string): number {
  const canal = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function contraste(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const AA = 4.5;

const themes = {
  clair: variablesDuBloc(':root'),
  sombre: variablesDuBloc("[data-theme='dark']"),
};

/** Paires découvertes par convention --x-bg / --x-fg. */
function pairesConvention(vars: Record<string, string>): [string, string, string][] {
  return Object.keys(vars)
    .filter((nom) => nom.endsWith('-bg') && vars[nom.replace(/-bg$/, '-fg')])
    .map((bg) => [bg.replace(/^--|-bg$/g, ''), vars[bg], vars[bg.replace(/-bg$/, '-fg')]]);
}

/** Combinaisons cœur du design (texte sur fonds de page/carte). */
const COMBOS_COEUR: [string, string, string][] = [
  ['ink sur canvas', '--ink', '--canvas'],
  ['ink sur surface', '--ink', '--surface'],
  ['muted sur canvas', '--muted', '--canvas'],
  ['muted sur surface', '--muted', '--surface'],
  ['brand (liens) sur canvas', '--brand', '--canvas'],
  ['brand (liens) sur surface', '--brand', '--surface'],
  ['teal (liens) sur canvas', '--teal', '--canvas'],
  ['teal (liens) sur surface', '--teal', '--surface'],
  ['bouton primaire', '--btn-primary-fg', '--btn-primary-bg'],
  ['bouton teal', '--btn-teal-fg', '--btn-teal-bg'],
];

for (const [nomTheme, vars] of Object.entries(themes)) {
  describe(`contrastes AA — thème ${nomTheme}`, () => {
    it('a des paires de pastilles à découvrir', () => {
      expect(pairesConvention(vars).length).toBeGreaterThan(10);
    });

    for (const [nom, bg, fg] of pairesConvention(vars)) {
      it(`pastille ${nom} : ${fg} sur ${bg}`, () => {
        expect(contraste(bg, fg)).toBeGreaterThanOrEqual(AA);
      });
    }

    for (const [libelle, fgVar, bgVar] of COMBOS_COEUR) {
      it(libelle, () => {
        const fg = vars[fgVar];
        const bg = vars[bgVar];
        expect(fg, `${fgVar} manquante`).toBeTruthy();
        expect(bg, `${bgVar} manquante`).toBeTruthy();
        expect(contraste(bg!, fg!)).toBeGreaterThanOrEqual(AA);
      });
    }

    it('texte blanc lisible sur le fond hero', () => {
      // Le hero garde son bleu nuit dans les deux thèmes.
      const hero = themes.clair['--hero'];
      expect(contraste(hero, '#ffffff')).toBeGreaterThanOrEqual(AA);
    });
  });
}
