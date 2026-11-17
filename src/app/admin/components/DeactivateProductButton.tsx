'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { adminDeactivateProductAction } from '@/app/actions/shop'

export function DeactivateProductButton({ productId }: { productId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function deactivate() {
    if (!confirm('Desativar este produto? Ele sairá do catálogo público.')) return
    setLoading(true)
    const result = await adminDeactivateProductAction(productId)
    setLoading(false)
    if (!result.success) {
      alert(result.errors.general[0] ?? 'Erro ao desativar')
      return
    }
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={() => void deactivate()}
      disabled={loading}
      className="text-sm text-red-600 hover:underline disabled:opacity-60 dark:text-red-400"
    >
      {loading ? '...' : 'Desativar'}
    </button>
  )
}
