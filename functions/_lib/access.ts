/// <reference types="@cloudflare/workers-types" />

/**
 * Garde d'accès admin. La protection principale est la politique Cloudflare
 * Access posée sur /admin* et /api/admin/*. Access injecte alors l'en-tête
 * Cf-Access-Authenticated-User-Email ; on l'exige en défense en profondeur.
 * Renvoie l'e-mail de l'admin, ou null si non authentifié.
 */
export function adminEmail(request: Request): string | null {
  const email = request.headers.get('Cf-Access-Authenticated-User-Email');
  return email && email.length > 0 ? email : null;
}
