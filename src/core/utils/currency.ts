export function formatCents(
  cents: number,
  locale?: string,
  currency?: string,
): string {
  const safeCents = Number.isFinite(cents) ? Math.round(cents) : 0;
  return new Intl.NumberFormat(locale ?? undefined, {
    style: 'currency',
    currency: currency ?? 'USD',
  }).format(safeCents / 100);
}
