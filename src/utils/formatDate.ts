/**
 * Formatea una cadena de fecha en formato legible en español.
 * @param dateString Cadena de fecha (p.ej. "2026-03-10")
 * @returns Fecha formateada (p.ej. "10 de marzo de 2026") o cadena original si es inválida
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? dateString
    : date.toLocaleDateString('es-ES', options);
}
