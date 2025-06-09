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

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';

  // Handle dd/MM/yyyy
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`;
    }
  }

  // Handle ISO format yyyy-MM-dd
  if (dateString.includes('-')) {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}/${mm}/${dd}`;
    }
  }

  return '—';
}





