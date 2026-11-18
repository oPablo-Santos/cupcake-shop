import { left, right, type Either } from '@business/either'
import type { AdminUser } from '@domain/adminUser'
import type { DomainError } from '@domain/errors'
import {
  adminMisconfigured,
  adminNotFound,
  cannotDeactivateSelf,
  invalidCredentials,
  usernameTaken,
  weakPassword,
} from '@domain/errors'
import type { IAdminUserRepository } from '@business/iAdminUserRepository'
import type { IAdminAuth } from '@business/useCases/adminAuth'
import { DUMMY_PASSWORD_HASH, hashPassword, verifyPassword } from '@business/passwordHash'
import { isWeakPassword } from '@business/passwordPolicy'

function isUniqueViolation(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2002'
  )
}

function bootstrapUsername() {
  const fromEnv = process.env.ADMIN_USERNAME?.trim()
  return fromEnv && fromEnv.length >= 2 ? fromEnv : 'admin'
}

function bootstrapPassword() {
  const password = process.env.ADMIN_PASSWORD?.trim()
  if (!password || isWeakPassword(password)) return null
  return password
}

export class BootstrapAdminUseCase {
  constructor(private readonly admins: IAdminUserRepository) {}

  async execute(): Promise<Either<DomainError, { bootstrapped: boolean }>> {
    const count = await this.admins.count()
    if (count > 0) return right({ bootstrapped: false })

    const password = bootstrapPassword()
    if (!password) return left(adminMisconfigured)

    try {
      await this.admins.create(bootstrapUsername(), hashPassword(password))
      return right({ bootstrapped: true })
    } catch (error) {
      if (isUniqueViolation(error)) return right({ bootstrapped: false })
      throw error
    }
  }
}

export class AdminLoginUseCase {
  constructor(
    private readonly admins: IAdminUserRepository,
    private readonly auth: IAdminAuth,
  ) {}

  async execute(
    username: string,
    password: string,
  ): Promise<Either<DomainError, { token: string }>> {
    if (!this.auth.isSessionConfigured()) {
      return left(adminMisconfigured)
    }

    const row = await this.admins.findByUsername(username.trim())
    if (!row) {
      verifyPassword(password, DUMMY_PASSWORD_HASH)
      return left(invalidCredentials)
    }
    if (!row.active || !verifyPassword(password, row.passwordHash)) {
      return left(invalidCredentials)
    }

    const token = this.auth.createSessionToken(row.id)
    if (!token) return left(adminMisconfigured)
    return right({ token })
  }
}

export class ListAdminUsersUseCase {
  constructor(private readonly admins: IAdminUserRepository) {}

  async execute(): Promise<Either<DomainError, AdminUser[]>> {
    const users = await this.admins.findAll()
    return right(users)
  }
}

export class CreateAdminUserUseCase {
  constructor(private readonly admins: IAdminUserRepository) {}

  async execute(username: string, password: string): Promise<Either<DomainError, AdminUser>> {
    const normalized = username.trim()
    if (isWeakPassword(password)) {
      return left(weakPassword)
    }

    const existing = await this.admins.findByUsername(normalized)
    if (existing) return left(usernameTaken)

    const created = await this.admins.create(normalized, hashPassword(password))
    return right(created)
  }
}

export class DeactivateAdminUserUseCase {
  constructor(private readonly admins: IAdminUserRepository) {}

  async execute(
    targetId: string,
    currentAdminId: string,
  ): Promise<Either<DomainError, AdminUser>> {
    if (targetId === currentAdminId) return left(cannotDeactivateSelf)

    const updated = await this.admins.setActive(targetId, false)
    if (!updated) return left(adminNotFound)
    return right(updated)
  }
}