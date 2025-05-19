export function convertToIsoDate(dateStr?: string): string | null {
  if (!dateStr) return null;

  const [day, month, year] = dateStr.split('/');
  const isoDate = new Date(`${year}-${month}-${day}T00:00:00Z`);

  return isNaN(isoDate.getTime()) ? null : isoDate.toISOString();
}
