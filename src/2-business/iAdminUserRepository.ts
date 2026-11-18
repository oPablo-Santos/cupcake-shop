import type { AdminUser } from '@domain/adminUser'

export type AdminUserCredential = AdminUser & { passwordHash: string }

export interface IAdminUserRepository {
  count(): Promise<number>
  findByUsername(username: string): Promise<AdminUserCredential | null>
  findById(id: string): Promise<AdminUser | null>
  findAll(): Promise<AdminUser[]>
  create(username: string, passwordHash: string): Promise<AdminUser>
  setActive(id: string, active: boolean): Promise<AdminUser | null>
}