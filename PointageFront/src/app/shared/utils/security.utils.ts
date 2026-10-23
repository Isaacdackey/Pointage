/**
 * Utilitaire d'échappement HTML pour prévenir les injections XSS
 * dans les popups, infobulles et marqueurs personnalisés Leaflet.
 */
export function escapeHtml(str: string | null | undefined): string {
  if (str === null || str === undefined) {
    return '';
  }
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
