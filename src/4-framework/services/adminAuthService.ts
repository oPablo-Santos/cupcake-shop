import crypto from 'crypto'
import type { IAdminAuth } from '@business/useCases/adminAuth'

const SESSION_COOKIE = 'admin_session'
const MAX_AGE_SEC = 60 * 60 * 8

const WEAK_VALUES = new Set([
  'change-me',
  'change-me-long-random-string',
  'dev-insecure',
  'password',
  'admin',
  '123456',
  '12345678',
])

function isWeakSecret(value: string) {
  const normalized = value.trim().toLowerCase()
  return normalized.length < 16 || WEAK_VALUES.has(normalized)
}

function isWeakPassword(value: string) {
  const normalized = value.trim().toLowerCase()
  return normalized.length < 12 || WEAK_VALUES.has(normalized)
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim()
  if (!secret || isWeakSecret(secret)) return null
  return secret
}

function configuredAdminPassword() {
  const password = process.env.ADMIN_PASSWORD?.trim()
  if (!password || isWeakPassword(password)) return null
  return password
}

export class AdminAuthService implements IAdminAuth {
  verifyPassword(password: string) {
    const expected = configuredAdminPassword()
    if (!expected) return false
    const a = Buffer.from(password)
    const b = Buffer.from(expected)
    if (a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
  }

  isSessionConfigured() {
    return sessionSecret() !== null
  }

  createSessionToken() {
    const secret = sessionSecret()
    if (!secret) return null

    const issuedAt = Date.now().toString()
    const nonce = crypto.randomBytes(16).toString('hex')
    const payload = `${issuedAt}.${nonce}`
    const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    return `${payload}.${sig}`
  }

  verifySessionToken(token: string | undefined) {
    const secret = sessionSecret()
    if (!secret || !token) return false

    const parts = token.split('.')
    if (parts.length !== 3) return false
    const [issuedAt, nonce, sig] = parts
    if (!issuedAt || !nonce || !sig) return false

    const payload = `${issuedAt}.${nonce}`
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    try {
      if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false
    } catch {
      return false
    }

    const ageMs = Date.now() - Number(issuedAt)
    return Number.isFinite(ageMs) && ageMs >= 0 && ageMs <= MAX_AGE_SEC * 1000
  }
}

export { SESSION_COOKIE, MAX_AGE_SEC }
