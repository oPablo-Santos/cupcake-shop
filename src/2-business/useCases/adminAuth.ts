import { left, right, type Either } from '@business/either'
import type { DomainError } from '@domain/errors'
import { invalidCredentials } from '@domain/errors'
import type { IAdminUserRepository } from '@business/iAdminUserRepository'

export interface IAdminAuth {
  createSessionToken(adminUserId: string): string | null
  verifySessionToken(token: string | undefined): string | null
  isSessionConfigured(): boolean
}

export class VerifyAdminSessionUseCase {
  constructor(
    private readonly auth: IAdminAuth,
    private readonly admins: IAdminUserRepository,
  ) {}

  async execute(token: string | undefined): Promise<Either<DomainError, { adminUserId: string }>> {
    const adminUserId = this.auth.verifySessionToken(token)
    if (!adminUserId) return left(invalidCredentials)

    const admin = await this.admins.findById(adminUserId)
    if (!admin?.active) return left(invalidCredentials)

    return right({ adminUserId })
  }
}