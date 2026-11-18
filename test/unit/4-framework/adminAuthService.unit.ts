import { AdminAuthService } from '@framework/services/adminAuthService'

describe('AdminAuthService', () => {
  const originalSecret = process.env.ADMIN_SESSION_SECRET

  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = 'test-session-secret-32chars-min'
  })

  afterEach(() => {
    process.env.ADMIN_SESSION_SECRET = originalSecret
  })

  it('cria e valida token com adminUserId', () => {
    const auth = new AdminAuthService()
    const token = auth.createSessionToken('admin-user-id')
    expect(token).toBeTruthy()
    expect(auth.verifySessionToken(token!)).toBe('admin-user-id')
    expect(auth.verifySessionToken('invalid.token.here.sig')).toBeNull()
  })
})