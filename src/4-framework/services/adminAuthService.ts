import crypto from 'crypto'
import type { IAdminAuth } from '@business/useCases/adminAuth'
import { WEAK_VALUES } from '@business/passwordPolicy'

const SESSION_COOKIE = 'admin_session'
const MAX_AGE_SEC = 60 * 60 * 8

function isWeakSecret(value: string) {
  const normalized = value.trim().toLowerCase()
  return normalized.length < 16 || WEAK_VALUES.has(normalized)
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim()
  if (!secret || isWeakSecret(secret)) return null
  return secret
}

export class AdminAuthService implements IAdminAuth {
  isSessionConfigured() {
    return sessionSecret() !== null
  }

  createSessionToken(adminUserId: string) {
    const secret = sessionSecret()
    if (!secret) return null

    const issuedAt = Date.now().toString()
    const nonce = crypto.randomBytes(16).toString('hex')
    const payload = `${adminUserId}.${issuedAt}.${nonce}`
    const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    return `${payload}.${sig}`
  }

  verifySessionToken(token: string | undefined) {
    const secret = sessionSecret()
    if (!secret || !token) return null

    const parts = token.split('.')
    if (parts.length !== 4) return null
    const [adminUserId, issuedAt, nonce, sig] = parts
    if (!adminUserId || !issuedAt || !nonce || !sig) return null

    const payload = `${adminUserId}.${issuedAt}.${nonce}`
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    try {
      if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
    } catch {
      return null
    }

    const ageMs = Date.now() - Number(issuedAt)
    if (!Number.isFinite(ageMs) || ageMs < 0 || ageMs > MAX_AGE_SEC * 1000) return null

    return adminUserId
  }
}

export { SESSION_COOKIE, MAX_AGE_SEC }