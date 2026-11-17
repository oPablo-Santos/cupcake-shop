export function formatCents(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function parseReaisToCents(value: string | number): number | null {
  const raw = typeof value === 'number' ? String(value) : value.trim()
  if (!raw) return null

  const normalized = raw.replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null

  const [reaisPart, fracPart = ''] = normalized.split('.')
  const centsFrac = fracPart.padEnd(2, '0').slice(0, 2)
  const reais = Number(reaisPart)
  const cents = Number(centsFrac)
  if (!Number.isSafeInteger(reais) || !Number.isSafeInteger(cents)) return null

  return reais * 100 + cents
}
