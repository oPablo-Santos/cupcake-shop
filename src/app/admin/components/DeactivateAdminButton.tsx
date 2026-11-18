'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { adminDeactivateAdminAction } from '@/app/actions/shop'

export function DeactivateAdminButton({ adminId, username }: { adminId: string; username: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onDeactivate() {
    if (!window.confirm(`Desativar o administrador “${username}”?`)) return
    setLoading(true)
    setError(null)
    const result = await adminDeactivateAdminAction(adminId)
    setLoading(false)
    if (!result.success) {
      setError(result.errors.general[0] ?? 'Não foi possível desativar')
      return
    }
    router.refresh()
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={loading}
        onClick={() => void onDeactivate()}
        className="text-sm font-medium text-red-600 hover:underline disabled:opacity-60 dark:text-red-400"
      >
        {loading ? 'Desativando...' : 'Desativar'}
      </button>
      {error ? <span className="text-xs text-red-600 dark:text-red-400">{error}</span> : null}
    </div>
  )
}