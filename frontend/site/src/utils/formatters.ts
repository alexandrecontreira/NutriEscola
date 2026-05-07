export function formatCalories(value: number): string {
  return `${Math.round(value).toLocaleString('pt-BR')} kcal`;
}

export function formatGrams(value: number): string {
  if (value >= 1000) return `${(value / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg`;
  return `${Math.round(value).toLocaleString('pt-BR')} g`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(value));
}
