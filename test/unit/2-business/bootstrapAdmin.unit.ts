import { BootstrapAdminUseCase, AdminLoginUseCase } from '@business/useCases/manageAdmin'
import type { AdminUserCredential, IAdminUserRepository } from '@business/iAdminUserRepository'
import type { IAdminAuth } from '@business/useCases/adminAuth'
import { hashPassword } from '@business/passwordHash'
import { adminMisconfigured, invalidCredentials } from '@domain/errors'

describe('BootstrapAdminUseCase', () => {
  const originalPassword = process.env.ADMIN_PASSWORD
  const originalUsername = process.env.ADMIN_USERNAME

  afterEach(() => {
    process.env.ADMIN_PASSWORD = originalPassword
    process.env.ADMIN_USERNAME = originalUsername
  })

  it('cria o primeiro admin quando count é zero', async () => {
    process.env.ADMIN_PASSWORD = 'cupcake-admin-dev'
    delete process.env.ADMIN_USERNAME

    const created: string[] = []
    const repo: IAdminUserRepository = {
      count: async () => 0,
      findByUsername: async () => null,
      findById: async () => null,
      findAll: async () => [],
      create: async (username) => {
        created.push(username)
        return { id: '1', username, active: true, createdAt: new Date() }
      },
      setActive: async () => null,
    }

    const result = await new BootstrapAdminUseCase(repo).execute()
    expect(result.kind).toBe('right')
    expect(created).toEqual(['admin'])
  })

  it('falha se não houver ADMIN_PASSWORD configurado', async () => {
    delete process.env.ADMIN_PASSWORD
    const repo: IAdminUserRepository = {
      count: async () => 0,
      findByUsername: async () => null,
      findById: async () => null,
      findAll: async () => [],
      create: async () => ({ id: '1', username: 'admin', active: true, createdAt: new Date() }),
      setActive: async () => null,
    }

    const result = await new BootstrapAdminUseCase(repo).execute()
    expect(result).toEqual({ kind: 'left', value: adminMisconfigured })
  })
})

describe('AdminLoginUseCase', () => {
  it('emite token quando credenciais conferem', async () => {
    const row: AdminUserCredential = {
      id: 'admin-1',
      username: 'admin',
      active: true,
      createdAt: new Date(),
      passwordHash: hashPassword('secure-pass-123'),
    }

    const repo: IAdminUserRepository = {
      count: async () => 1,
      findByUsername: async (username) => (username === 'admin' ? row : null),
      findById: async () => null,
      findAll: async () => [],
      create: async () => row,
      setActive: async () => null,
    }

    const auth: IAdminAuth = {
      isSessionConfigured: () => true,
      createSessionToken: (adminUserId) => `token-for-${adminUserId}`,
      verifySessionToken: () => null,
    }

    const result = await new AdminLoginUseCase(repo, auth).execute('admin', 'secure-pass-123')
    expect(result).toEqual({ kind: 'right', value: { token: 'token-for-admin-1' } })

    const invalid = await new AdminLoginUseCase(repo, auth).execute('admin', 'wrong')
    expect(invalid).toEqual({ kind: 'left', value: invalidCredentials })
  })
})