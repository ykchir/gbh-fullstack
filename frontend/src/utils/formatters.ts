export function formatCurrency(
  value: number,
  locale = "fr-FR",
  currency = "EUR",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}
