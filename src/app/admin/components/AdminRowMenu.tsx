'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { adminActivateAdminAction, adminDeactivateAdminAction } from '@/app/actions/shop'
import { ActionMenu } from '@/app/admin/components/ActionMenu'

export function AdminRowMenu({
  adminId,
  username,
  active,
  isSelf,
}: {
  adminId: string
  username: string
  active: boolean
  isSelf: boolean
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function setActive(next: boolean) {
    const message = next
      ? `Ativar o administrador “${username}”?`
      : `Inativar o administrador “${username}”?`
    if (!window.confirm(message)) return
    setBusy(true)
    setError(null)
    const result = next ? await adminActivateAdminAction(adminId) : await adminDeactivateAdminAction(adminId)
    setBusy(false)
    if (!result.success) {
      setError(result.errors.general[0] ?? 'Não foi possível atualizar')
      return
    }
    router.refresh()
  }

  if (isSelf) return <span className="text-xs text-[var(--muted-foreground)]">—</span>

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <ActionMenu
        busy={busy}
        items={[
          { label: 'Ativar', disabled: active, onSelect: () => void setActive(true) },
          { label: 'Inativar', danger: true, disabled: !active, onSelect: () => void setActive(false) },
        ]}
      />
      {error ? <span className="text-xs text-red-600 dark:text-red-400">{error}</span> : null}
    </div>
  )
}
