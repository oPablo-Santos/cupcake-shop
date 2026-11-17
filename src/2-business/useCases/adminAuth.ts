import { left, right, type Either } from '@business/either'
import type { DomainError } from '@domain/errors'
import { invalidCredentials, adminMisconfigured } from '@domain/errors'

export interface IAdminAuth {
  verifyPassword(password: string): boolean
  createSessionToken(): string | null
  verifySessionToken(token: string | undefined): boolean
  isSessionConfigured(): boolean
}

export class AdminLoginUseCase {
  constructor(private readonly auth: IAdminAuth) {}

  execute(password: string): Either<DomainError, { token: string }> {
    if (!this.auth.isSessionConfigured()) {
      return left(adminMisconfigured)
    }
    if (!this.auth.verifyPassword(password)) {
      return left(invalidCredentials)
    }
    const token = this.auth.createSessionToken()
    if (!token) return left(adminMisconfigured)
    return right({ token })
  }
}

export class VerifyAdminSessionUseCase {
  constructor(private readonly auth: IAdminAuth) {}

  execute(token: string | undefined): Either<DomainError, { ok: true }> {
    if (!this.auth.verifySessionToken(token)) {
      return left(invalidCredentials)
    }
    return right({ ok: true as const })
  }
}
