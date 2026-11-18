import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 } as const

const dummySalt = Buffer.from('0123456789abcdef0123456789abcdef', 'hex')
const dummyHash = scryptSync('dummy-timing-pad', dummySalt, 64, SCRYPT_OPTIONS)
export const DUMMY_PASSWORD_HASH = `${dummySalt.toString('hex')}:${dummyHash.toString('hex')}`

export function hashPassword(password: string) {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, 64, SCRYPT_OPTIONS)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

export function verifyPassword(password: string, stored: string) {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false

  const salt = Buffer.from(saltHex, 'hex')
  const expected = Buffer.from(hashHex, 'hex')
  if (expected.length !== 64) return false

  const hash = scryptSync(password, salt, 64, SCRYPT_OPTIONS)
  return timingSafeEqual(hash, expected)
}