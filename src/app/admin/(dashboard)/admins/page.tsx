import { adminListAdminsAction, isAdminAuthenticatedAction } from '@/app/actions/shop'
import { AdminNav } from '@/app/admin/components/AdminNav'
import { CreateAdminForm } from '@/app/admin/components/CreateAdminForm'
import { DeactivateAdminButton } from '@/app/admin/components/DeactivateAdminButton'

export default async function AdminAdminsPage() {
  const session = await isAdminAuthenticatedAction()
  const result = await adminListAdminsAction()

  if (!result.success) {
    return <p className="text-red-600 dark:text-red-400">{result.errors.general[0]}</p>
  }

  const currentId = session.data.adminUserId

  return (
    <div className="space-y-8">
      <AdminNav />
      <div>
        <h1 className="text-2xl font-semibold">Administradores</h1>
        <p className="text-[var(--muted-foreground)]">
          Bootstrap automático no primeiro acesso com <code className="text-sm">ADMIN_PASSWORD</code>.
        </p>
      </div>
      <CreateAdminForm />

      {result.data.length === 0 ? (
        <div className="glass-card p-8 text-center text-[var(--muted-foreground)]">
          Nenhum administrador cadastrado.
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)] text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                  <th className="px-4 py-3 font-medium">Usuário</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {result.data.map((admin) => (
                  <tr key={admin.id} className="transition hover:bg-[var(--surface-muted)]/50">
                    <td className="px-4 py-3 font-medium">
                      {admin.username}
                      {admin.id === currentId ? (
                        <span className="ml-2 text-xs text-[var(--muted-foreground)]">(você)</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          admin.active
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        }`}
                      >
                        {admin.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {admin.active && admin.id !== currentId ? (
                        <DeactivateAdminButton adminId={admin.id} username={admin.username} />
                      ) : (
                        <span className="text-xs text-[var(--muted-foreground)]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}