export const WEAK_VALUES = new Set([
  'change-me',
  'change-me-long-random-string',
  'dev-insecure',
  'password',
  'admin',
  '123456',
  '12345678',
])

export function isWeakPassword(value: string) {
  const normalized = value.trim().toLowerCase()
  return normalized.length < 12 || WEAK_VALUES.has(normalized)
}