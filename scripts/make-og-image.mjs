// Génère l'image de partage (Open Graph) 1200×630 → public/og.png.
// Utilise sharp (dépendance d'Astro). Lancer : node scripts/make-og-image.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public', 'og.png');

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#14245C"/>
  <g transform="translate(120,232)">
    <path d="M0 36 L120 -8 L240 36 L120 80 Z" fill="#ffffff"/>
    <path d="M186 56 V96 q0 30 -66 30 q-66 0 -66 -30 V56" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round"/>
    <line x1="240" y1="36" x2="240" y2="108" stroke="#ffffff" stroke-width="14"/>
    <circle cx="240" cy="122" r="14" fill="#34D7A6"/>
  </g>
  <text x="430" y="300" font-family="Arial, Helvetica, sans-serif" font-size="120" font-weight="700" fill="#ffffff">Bac <tspan fill="#34D7A6">242</tspan></text>
  <text x="434" y="372" font-family="Arial, Helvetica, sans-serif" font-size="38" fill="#C7D2EC">Annales du baccalauréat congolais — gratuit</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('OG image générée : public/og.png');
