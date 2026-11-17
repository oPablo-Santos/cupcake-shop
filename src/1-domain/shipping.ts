export function normalizeZipCode(raw: string) {
  const digits = raw.replace(/\D/g, '')
  if (digits.length !== 8) return null
  return digits
}

export function calculateShippingCents(zipCode: string, subtotalCents: number) {
  const cep = normalizeZipCode(zipCode)
  if (!cep) return null
  if (subtotalCents >= 15_000) return 0

  const region = Number(cep.slice(0, 2))
  const base = 990
  const regional = (region % 60) * 35
  const weightBonus = Math.min(subtotalCents / 5000, 6) * 120

  return Math.min(4500, Math.round(base + regional + weightBonus))
}

export function formatZipCodeInput(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}
