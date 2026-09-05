export function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)
}

/** Affiche le prix, ou "Prix sur devis" quand le robot n'a pas de prix catalogue public. */
export function formatPriceOrQuote(price: number, currency: string, priceOnRequest?: boolean) {
  if (priceOnRequest || !price) return 'Prix sur devis'
  return formatPrice(price, currency)
}
