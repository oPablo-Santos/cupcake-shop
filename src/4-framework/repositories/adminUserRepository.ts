import type { AdminUser } from '@domain/adminUser'
import type { IAdminUserRepository } from '@business/iAdminUserRepository'
import { prisma } from '@framework/db/prisma'

function mapAdmin(row: {
  id: string
  username: string
  active: boolean
  createdAt: Date
  passwordHash?: string
}): AdminUser {
  return {
    id: row.id,
    username: row.username,
    active: row.active,
    createdAt: row.createdAt,
  }
}

export class AdminUserRepository implements IAdminUserRepository {
  async count() {
    return prisma.adminUser.count()
  }

  async findByUsername(username: string) {
    const row = await prisma.adminUser.findUnique({ where: { username } })
    if (!row) return null
    return { ...mapAdmin(row), passwordHash: row.passwordHash }
  }

  async findById(id: string) {
    const row = await prisma.adminUser.findUnique({ where: { id } })
    return row ? mapAdmin(row) : null
  }

  async findAll() {
    const rows = await prisma.adminUser.findMany({ orderBy: { username: 'asc' } })
    return rows.map(mapAdmin)
  }

  async create(username: string, passwordHash: string) {
    const row = await prisma.adminUser.create({
      data: { username, passwordHash },
    })
    return mapAdmin(row)
  }

  async setActive(id: string, active: boolean) {
    try {
      const row = await prisma.adminUser.update({
        where: { id },
        data: { active },
      })
      return mapAdmin(row)
    } catch {
      return null
    }
  }
}