import type { Product } from '@domain/product'

export function pickDailyProducts(products: Product[], date = new Date()) {
  const sorted = [...products].sort((a, b) => a.id.localeCompare(b.id))
  if (sorted.length <= 3) return sorted

  const dayKey = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
  let hash = 0
  for (const char of dayKey) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }

  const start = hash % sorted.length
  const picked: Product[] = []
  for (let i = 0; i < 3; i++) {
    picked.push(sorted[(start + i) % sorted.length])
  }
  return picked
}