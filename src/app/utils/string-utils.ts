export function formatCamelCase(path: string): string {
  return path
    .split('-')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

export function formatPremium(amount?: number, mode: string = ''): string {
  if (!amount) return '—';
  const normalizedMode = mode.toLowerCase();
  return `RM ${amount} / ${normalizedMode}`;
}
